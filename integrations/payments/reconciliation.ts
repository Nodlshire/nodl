import { Pool } from 'pg';
import { UPOStatus, UniversalPaymentObject } from './upo';
import { getProvider } from './router';
import { issueReceipt } from '../filecoin/audit/service';
import type { ReceiptInput } from '../filecoin/audit/core/receipt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const processedEventIds = new Set<string>();

/**
 * Ensures webhook logs and the UPO ledger tables exist with the extended columns.
 */
export async function ensureWebhookSchema(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS incoming_webhooks (
      id         SERIAL PRIMARY KEY,
      event_id   TEXT UNIQUE NOT NULL,
      payload    JSONB NOT NULL,
      headers    JSONB NOT NULL,
      status     TEXT DEFAULT 'PENDING',
      error      TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS upo_ledger (
      payment_id          UUID PRIMARY KEY,
      provider_reference  TEXT UNIQUE NOT NULL,
      provider            TEXT NOT NULL,
      amount_minor_units  BIGINT NOT NULL,
      currency            TEXT NOT NULL,
      status              TEXT NOT NULL,
      source_rail         TEXT,
      destination_rail    TEXT,
      metadata            JSONB,
      receipt_cid         TEXT,
      updated_at          TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

function isFinalState(status?: UPOStatus): boolean {
  return status === 'CAPTURED' || status === 'FAILED' || status === 'REFUNDED';
}

/**
 * Standard State Machine transition validator.
 */
export function validateStateTransition(current: UPOStatus | undefined, target: UPOStatus): void {
  if (!current) return;
  if (target === 'REFUNDED' && current !== 'CAPTURED') {
    throw new Error(`Invalid refund transition from ${current} to REFUNDED`);
  }
  if (target === 'CAPTURED' && current && current !== 'PENDING' && current !== 'PROCESSING' && current !== 'CAPTURED') {
    throw new Error(`Invalid state transition from ${current} to CAPTURED`);
  }
  if (isFinalState(current) && current !== target) {
    throw new Error(`Invalid state transition from final state "${current}" to "${target}"`);
  }
  if (current === 'PROCESSING' && target === 'PENDING') {
    throw new Error(`Invalid state rollback from "${current}" to "${target}"`);
  }
}

/**
 * Inserts or updates the UPO ledger when a payment is created.
 */
export async function recordPaymentCreated(
  upo: UniversalPaymentObject,
  providerReference: string,
  provider: string
): Promise<void> {
  await pool.query(
    `INSERT INTO upo_ledger (payment_id, provider_reference, provider, amount_minor_units, currency, status, source_rail, destination_rail, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (payment_id) DO UPDATE SET
       provider_reference = EXCLUDED.provider_reference,
       provider = EXCLUDED.provider,
       status = EXCLUDED.status,
       updated_at = NOW()`,
    [
      upo.payment_id,
      providerReference,
      provider,
      upo.amount_minor_units,
      upo.currency,
      upo.status,
      upo.source_rail,
      upo.destination_rail,
      JSON.stringify(upo.metadata),
    ]
  );
}

/**
 * Reconciles the state of a payment, handling DB updates and generating Filecoin receipts.
 */
export async function reconcilePaymentState(
  providerReference: string,
  targetStatus: UPOStatus,
  amountRefundedMinorUnits?: number
): Promise<{ receiptCid?: string }> {
  const ledgerRes = await pool.query(
    'SELECT status, receipt_cid, provider, amount_minor_units, currency, source_rail, destination_rail, metadata FROM upo_ledger WHERE provider_reference = $1',
    [providerReference]
  );

  const row = ledgerRes.rows[0];
  const currentStatus = row?.status as UPOStatus | undefined;
  const existingCid = row?.receipt_cid as string | undefined;

  validateStateTransition(currentStatus, targetStatus);

  await pool.query(
    'UPDATE upo_ledger SET status = $1, updated_at = NOW() WHERE provider_reference = $2',
    [targetStatus, providerReference]
  );

  if (targetStatus === 'CAPTURED' && !existingCid && row) {
    const cid = await triggerCoreReceiptGeneration({
      provider: row.provider,
      providerPaymentId: providerReference,
      amountMinorUnits: Number(row.amount_minor_units),
      currency: row.currency,
      sourceRail: row.source_rail,
      destinationRail: row.destination_rail,
      metadata: row.metadata,
      isRefund: false,
    });

    if (cid) {
      await pool.query(
        'UPDATE upo_ledger SET receipt_cid = $1, updated_at = NOW() WHERE provider_reference = $2',
        [cid, providerReference]
      );
      return { receiptCid: cid };
    }
  } else if (targetStatus === 'REFUNDED' && row) {
    const refundCid = await triggerCoreReceiptGeneration({
      provider: row.provider,
      providerPaymentId: providerReference,
      amountMinorUnits: amountRefundedMinorUnits ?? Number(row.amount_minor_units),
      currency: row.currency,
      sourceRail: row.source_rail,
      destinationRail: row.destination_rail,
      metadata: row.metadata,
      isRefund: true,
    });
    return { receiptCid: refundCid };
  }

  return { receiptCid: existingCid };
}

/**
 * Process an incoming webhook, logging and deduplicating it.
 */
export async function processIncomingWebhook(params: {
  eventId: string;
  provider: 'stripe' | 'checkout' | 'adyen' | 'coinbase' | 'bvnk' | 'okx';
  payload: string;
  headers: Record<string, string>;
  handler: () => Promise<void>;
}): Promise<void> {
  await pool.query(
    `INSERT INTO incoming_webhooks (event_id, payload, headers)
     VALUES ($1, $2, $3) ON CONFLICT (event_id) DO NOTHING`,
    [params.eventId, params.payload, JSON.stringify(params.headers)]
  );

  if (processedEventIds.has(params.eventId)) {
    return; // deduplicated in memory
  }
  processedEventIds.add(params.eventId);
  setTimeout(() => processedEventIds.delete(params.eventId), 600_000);

  try {
    await params.handler();

    await pool.query(
      "UPDATE incoming_webhooks SET status = 'PROCESSED' WHERE event_id = $1",
      [params.eventId]
    );
  } catch (err) {
    await pool.query(
      "UPDATE incoming_webhooks SET status = 'FAILED', error = $2 WHERE event_id = $1",
      [params.eventId, String(err)]
    );
    throw err;
  }
}

/**
 * Trigger Filecoin Audit Receipt Generation at the Core.
 */
export async function triggerCoreReceiptGeneration(params: {
  provider: string;
  providerPaymentId: string;
  amountMinorUnits: number;
  currency: string;
  sourceRail: string;
  destinationRail: string;
  metadata: Record<string, any>;
  isRefund: boolean;
}): Promise<string> {
  const amount = (params.amountMinorUnits / 100).toFixed(2);
  const currency = params.currency.toUpperCase() as any;
  const metadata = params.metadata || {};

  const payerAgent = params.isRefund ? 'did:ap4m:wnode-clearing' : (metadata.agent_urn ?? 'did:ap4m:anonymous-agent');
  const payeeAgent = params.isRefund ? (metadata.agent_urn ?? 'did:ap4m:anonymous-agent') : 'did:ap4m:wnode-clearing';
  const payerNode = params.isRefund ? (process.env.WNODE_OPERATOR_ID ?? 'wnode-unknown') : (metadata.user_id ?? 'user-unknown');
  const payeeNode = params.isRefund ? (metadata.user_id ?? 'user-unknown') : (process.env.WNODE_OPERATOR_ID ?? 'wnode-unknown');

  const receiptInput: ReceiptInput = {
    payerAgentId: payerAgent,
    payeeAgentId: payeeAgent,
    payerNodeId: payerNode,
    payeeNodeId: payeeNode,
    amount,
    currency,
    chain: 'ethereum',
    txHash: params.providerPaymentId,
    blockNumber: 0,
    blockTimestamp: Math.floor(Date.now() / 1000),
    contractAddress: `${params.provider}-psp`,
    paymentType: 'compute',
    protocolId: params.provider,
    integrationArchetype: 'Builders',
    issuedBy: process.env.NODE_PUBLIC_KEY_HEX ?? 'unknown',
  };

  try {
    const receipt = await issueReceipt(receiptInput);
    return receipt.cid ?? '';
  } catch (err) {
    console.warn('[reconciliation] Non-fatal Filecoin core receipt issuance failure:', err);
    return '';
  }
}

// ─── Central Fallback Polling Worker ──────────────────────────────────────────

export class CentralPollingWorker {
  private intervalId?: NodeJS.Timeout;

  start(intervalMs = 15000): void {
    this.intervalId = setInterval(() => {
      this.pollPendingTransactions().catch(err =>
        console.error('[CentralPollingWorker] Error polling pending payments:', err)
      );
    }, intervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async pollPendingTransactions(): Promise<void> {
    const res = await pool.query(
      `SELECT provider_reference, provider, status FROM upo_ledger
       WHERE status IN ('PENDING', 'PROCESSING') AND updated_at < NOW() - INTERVAL '60 seconds'`
    );

    for (const row of res.rows) {
      const ref = row.provider_reference;
      const providerName = row.provider as any;
      try {
        const adapter = getProvider(providerName);
        const latestStatus = await adapter.getPaymentStatus(ref);
        if (latestStatus !== row.status) {
          console.log(`[CentralPollingWorker] Status mismatch for ${ref} (${providerName}): local=${row.status}, provider=${latestStatus}. Reconciling...`);
          await reconcilePaymentState(ref, latestStatus);
        }
      } catch (err) {
        console.error(`[CentralPollingWorker] Failed to poll status for ${ref} via ${providerName}:`, err);
      }
    }
  }
}
export const centralPollingWorker = new CentralPollingWorker();
