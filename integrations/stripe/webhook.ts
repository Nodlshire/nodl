/**
 * Wnode × Stripe — Webhook Reconciliation Engine
 *
 * Implements strict event verification and delegates to the central payments
 * reconciliation core.
 */

import { Request, Response } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';
import { loadStripeConfig } from './config';
import {
  processIncomingWebhook,
  reconcilePaymentState,
  ensureWebhookSchema as ensureCoreSchema
} from '../payments/reconciliation';

// ─── Setup Tables ─────────────────────────────────────────────────────────────

export async function ensureWebhookSchema(): Promise<void> {
  await ensureCoreSchema();
}

// ─── Webhook Signature Verification ──────────────────────────────────────────

/**
 * Validates Stripe webhook signature.
 * Header format: t=timestamp,v1=signature
 */
export function verifySignature(
  payload: string,
  signatureHeader: string,
  secret: string
): boolean {
  try {
    const parts = signatureHeader.split(',');
    const tPart = parts.find(p => p.startsWith('t='));
    const vPart = parts.find(p => p.startsWith('v1='));

    if (!tPart || !vPart) return false;

    const timestamp = tPart.split('=')[1];
    const signature = vPart.split('=')[1];

    // Check expiration (max 5 minutes skew)
    const age = Math.abs(Date.now() / 1000 - Number(timestamp));
    if (age > 300) return false;

    const signedPayload = `${timestamp}.${payload}`;
    const expectedSig  = createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');

    return timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSig, 'hex')
    );
  } catch {
    return false;
  }
}

// ─── Webhook Controller Route ─────────────────────────────────────────────────

export async function handleStripeWebhook(req: Request, res: Response): Promise<Response> {
  const config = loadStripeConfig();
  const signature = req.headers['stripe-signature'];
  const rawBody = (req as { rawBody?: Buffer }).rawBody 
    ? (req as { rawBody: Buffer }).rawBody.toString('utf8')
    : JSON.stringify(req.body);

  if (!signature) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  // 1. Verify webhook signature
  const isValid = verifySignature(rawBody, String(signature), config.webhookSecret);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  const event = JSON.parse(rawBody) as {
    id: string;
    type: string;
    data: { object: Record<string, unknown> };
  };

  // 2. Delegate to the reconciliation core
  try {
    await processIncomingWebhook({
      eventId: event.id,
      provider: 'stripe',
      payload: rawBody,
      headers: req.headers as Record<string, string>,
      handler: async () => {
        const obj = event.data.object;
        const paymentIntentId = String(obj.id ?? obj.payment_intent ?? '');
        if (!paymentIntentId) return;

        if (event.type === 'payment_intent.succeeded') {
          await reconcilePaymentState(paymentIntentId, 'CAPTURED');
        } else if (event.type === 'payment_intent.payment_failed') {
          await reconcilePaymentState(paymentIntentId, 'FAILED');
        } else if (event.type === 'charge.refunded') {
          const refundAmt = obj.amount_refunded ? Number(obj.amount_refunded) : undefined;
          await reconcilePaymentState(paymentIntentId, 'REFUNDED', refundAmt);
        }
      }
    });
  } catch (err) {
    console.error(`[stripe-webhook] Event ${event.id} process failed:`, err);
    return res.status(500).json({ error: String(err) });
  }

  return res.status(200).json({ received: true });
}

/**
 * Compatibility helper for existing webhook event processing tests.
 */
export async function processWebhookEvent(event: {
  type: string;
  data: { object: Record<string, unknown> };
}): Promise<void> {
  const obj = event.data.object;
  const paymentIntentId = String(obj.id ?? obj.payment_intent ?? '');
  if (!paymentIntentId) return;

  if (event.type === 'payment_intent.succeeded') {
    await reconcilePaymentState(paymentIntentId, 'CAPTURED');
  } else if (event.type === 'payment_intent.payment_failed') {
    await reconcilePaymentState(paymentIntentId, 'FAILED');
  } else if (event.type === 'charge.refunded') {
    const refundAmt = obj.amount_refunded ? Number(obj.amount_refunded) : undefined;
    await reconcilePaymentState(paymentIntentId, 'REFUNDED', refundAmt);
  }
}
