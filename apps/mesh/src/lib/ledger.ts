import { PoolClient } from 'pg';
import Stripe from 'stripe';
import { runAiJob } from "@ai/ai_router";

export type LedgerRole = 'platform' | 'l1' | 'l2' | 'founder' | 'nodlrs_pool' | 'sales_source' | 'management';
export type LedgerDirection = 'credit' | 'debit';

export interface LedgerEntry {
  userId?: string;
  role: LedgerRole;
  amount: number;
  currency: string;
  direction: LedgerDirection;
  meta?: any;
}

/**
 * Deterministic allocation engine for Stripe payments.
 * 
 * Wnode Economic Constitution (Hard-Coded):
 * - 10% -> Sales Source
 * - 70% -> Nodlr Pool
 * - 3%  -> L1 Affiliate
 * - 7%  -> L2 Affiliate
 * - 7%  -> Management Licensee
 * - 3%  -> Founder Tree
 * 
 * Rounding Strategy:
 * All fees are calculated using integer floor division.
 * The 'nodlrs_pool' receives the total remainder to ensure zero leakage.
 */
export function calculateAllocations(
  grossAmount: number,
  currency: string,
  metadata: { userId?: string; l1Id?: string; l2Id?: string; founderId?: string; salesSourceId?: string }
): LedgerEntry[] {
  const entries: LedgerEntry[] = [];
  let remaining = grossAmount;

  // 1. Sales Source (10%)
  const salesSourceAmount = Math.floor(grossAmount * 0.10);
  entries.push({
    userId: metadata.salesSourceId,
    role: 'sales_source',
    amount: salesSourceAmount,
    currency,
    direction: 'credit'
  });
  remaining -= salesSourceAmount;

  // 2. Management Licensee (7%)
  const managementAmount = Math.floor(grossAmount * 0.07);
  entries.push({
    role: 'management',
    amount: managementAmount,
    currency,
    direction: 'credit'
  });
  remaining -= managementAmount;

  // 3. Level 1 Affiliate (3%)
  if (metadata.l1Id) {
    const l1Amount = Math.floor(grossAmount * 0.03);
    entries.push({
      userId: metadata.l1Id,
      role: 'l1',
      amount: l1Amount,
      currency,
      direction: 'credit'
    });
    remaining -= l1Amount;
  }

  // 4. Level 2 Affiliate (7%)
  if (metadata.l2Id) {
    const l2Amount = Math.floor(grossAmount * 0.07);
    entries.push({
      userId: metadata.l2Id,
      role: 'l2',
      amount: l2Amount,
      currency,
      direction: 'credit'
    });
    remaining -= l2Amount;
  }

  // 5. Founder (3%)
  if (metadata.founderId) {
    const founderAmount = Math.floor(grossAmount * 0.03);
    entries.push({
      userId: metadata.founderId,
      role: 'founder',
      amount: founderAmount,
      currency,
      direction: 'credit'
    });
    remaining -= founderAmount;
  }

  // 6. Nodl'rs Pool (70% Nominal, plus any unallocated affiliate/founder slippage)
  entries.push({
    role: 'nodlrs_pool',
    amount: remaining,
    currency,
    direction: 'credit',
    userId: metadata.userId
  });

  return entries;
}

/**
 * Atomicly records a Stripe event and its ledger allocations.
 */
export async function allocateLedgerForStripeEvent(
  event: Stripe.Event,
  client: PoolClient
): Promise<void> {
  const stripeEventId = event.id;

  // 1. Idempotency Check & Lock
  const existingEvent = await client.query(
    'SELECT status FROM stripe_events WHERE stripe_event_id = $1 FOR UPDATE',
    [stripeEventId]
  );

  if (existingEvent.rows.length > 0) {
    if (existingEvent.rows[0].status === 'processed') {
      console.log(`[Ledger] Event ${stripeEventId} already processed.`);
      return;
    }
  } else {
    // Insert initial record
    await client.query(
      'INSERT INTO stripe_events (stripe_event_id, type, raw, status) VALUES ($1, $2, $3, $4)',
      [stripeEventId, event.type, JSON.stringify(event), 'pending']
    );
  }

  // 2. Extract amount and metadata
  let grossAmount = 0;
  let currency = 'usd';
  let metadata: any = {};

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    grossAmount = session.amount_total || 0;
    currency = session.currency || 'usd';
    metadata = session.metadata || {};
  } else if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice;
    grossAmount = invoice.amount_paid;
    currency = invoice.currency || 'usd';
    metadata = invoice.metadata || {};
  } else if (event.type === 'charge.succeeded' || event.type === 'payment_intent.succeeded') {
    const obj = event.data.object as any;
    grossAmount = obj.amount || obj.amount_received || 0;
    currency = obj.currency || 'usd';
    metadata = obj.metadata || {};
  }

  if (grossAmount <= 0) {
    console.warn(`[Ledger] Event ${stripeEventId} has zero or negative amount: ${grossAmount}`);
    await client.query(
      'UPDATE stripe_events SET status = $1 WHERE stripe_event_id = $2',
      ['processed', stripeEventId]
    );
    return;
  }

  // 3. Calculate Allocations
  const allocations = calculateAllocations(grossAmount, currency, {
    userId: metadata.userId,
    l1Id: metadata.l1Id,
    l2Id: metadata.l2Id,
    founderId: metadata.founderId,
    salesSourceId: metadata.salesSourceId,
  });

  // 4. Write Ledger Rows
  for (const entry of allocations) {
    await client.query(
      `INSERT INTO ledger (stripe_event_id, user_id, role, amount, currency, direction, meta)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        stripeEventId,
        entry.userId || null,
        entry.role,
        entry.amount,
        entry.currency,
        entry.direction,
        JSON.stringify(entry.meta || {})
      ]
    );
  }

  // 5. Mark as Processed
  await client.query(
    'UPDATE stripe_events SET status = $1 WHERE stripe_event_id = $2',
    ['processed', stripeEventId]
  );

  console.log(`[Ledger] Successfully allocated ${grossAmount} ${currency} for event ${stripeEventId} using 10/70/3/7/7/3 model`);
}

/**
 * AI Insight Hook for Ledger (Phase 3b)
 */
export async function getAiLedgerInsight(ledgerState: any[]) {
  try {
    const job = {
      id: "ledger-insight",
      type: "score",
      payload: { size: ledgerState.length }
    };
    const result = await runAiJob(job);
    if (result.status === "ok") {
      return result.data;
    }
    return null;
  } catch (err) {
    console.error("[AI Ledger Error]", err);
    return null;
  }
}
