/**
 * Wnode Audit Layer — Public Verification Endpoint
 *
 * GET  /api/v1/receipts/verify/:cid        — single CID verification
 * POST /api/v1/receipts/verify/batch       — batch (max 100 CIDs)
 * POST /api/v1/receipts/webhooks           — register a webhook
 * GET  /api/v1/receipts/chain/:agentId     — receipt chain for an agent
 *
 * All read endpoints are public and rate-limited.
 * Receipt creation (POST /api/v1/receipts) requires mTLS.
 *
 * Feature flag: ENABLE_FILECOIN_RECEIPTS=true
 */

import express, { Request, Response, NextFunction } from 'express';
import { findReceiptByCID, findReceiptsByPayer } from './index/receipt-index';
import { verifyReceiptHash }     from './core/hasher';
import { verifyReceiptSignature } from './core/signer';
import { verifyCIDIntegrity }    from './storage/car';
import { pollDealStatus, verifyPDPProof } from './storage/filecoin';
import { MachinePaymentReceipt } from './core/receipt';

// ─── Router ───────────────────────────────────────────────────────────────────

export const verificationRouter = express.Router();

// Rate limiting (in production: use Redis-backed limiter)
const requestCounts = new Map<string, number>();
const RATE_LIMIT = 100; // req/min per IP

function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip ?? 'unknown';
  const count = (requestCounts.get(ip) ?? 0) + 1;
  requestCounts.set(ip, count);
  setTimeout(() => requestCounts.set(ip, Math.max(0, (requestCounts.get(ip) ?? 0) - 1)), 60_000);

  if (count > RATE_LIMIT) {
    res.status(429).json({ error: 'Rate limit exceeded. Max 100 requests/minute.' });
    return;
  }
  next();
}

verificationRouter.use(rateLimiter);

// ─── GET /verify/:cid ─────────────────────────────────────────────────────────

verificationRouter.get('/verify/:cid', async (req: Request, res: Response) => {
  const { cid } = req.params;

  // 1. Look up in local Postgres index
  const receipt = await findReceiptByCID(cid);
  if (!receipt) {
    return res.status(404).json({ error: 'CID not found in Wnode receipt index.' });
  }

  // 2. Verify hash integrity
  const hashValid = verifyReceiptHash(receipt);

  // 3. Verify Ed25519 signature
  const sigValid = verifyReceiptSignature(receipt, receipt.issuedBy);

  // 4. Tamper detection: re-derive CID from stored receipt
  const cidValid = await verifyCIDIntegrity(receipt);

  if (!hashValid || !sigValid) {
    // Tamper detected — return 409 with evidence
    return res.status(409).json({
      cid,
      verified: false,
      hashValid,
      signatureValid: sigValid,
      cidValid,
      error: 'Receipt integrity check failed — possible tamper detected.',
    });
  }

  // 5. Live Filecoin deal status
  const filecoinDeals = await pollDealStatus(cid);

  // 6. PDP proof (async — non-blocking)
  const pdp = await verifyPDPProof(cid);

  return res.status(200).json({
    cid,
    verified:        true,
    receiptId:       receipt.receiptId,
    hashValid,
    signatureValid:  sigValid,
    cidValid,
    signerNodeId:    receipt.issuedBy,
    payerAgentId:    receipt.payerAgentId,
    payeeAgentId:    receipt.payeeAgentId,
    protocolId:      receipt.protocolId,
    paymentType:     receipt.paymentType,
    amount:          receipt.amount,
    currency:        receipt.currency,
    chain:           receipt.chain,
    txHash:          receipt.txHash,
    blockNumber:     receipt.blockNumber,
    blockTimestamp:  receipt.blockTimestamp,
    issuedAt:        receipt.issuedAt,
    filecoinDeals,
    pdpProofVerified: pdp.verified,
    retrievalUrl:    `https://gateway.lighthouse.storage/ipfs/${cid}`,
    previousReceiptCid: receipt.previousReceiptCid,
  });
});

// ─── POST /verify/batch ───────────────────────────────────────────────────────

verificationRouter.post('/verify/batch', async (req: Request, res: Response) => {
  const { cids } = req.body as { cids?: string[] };

  if (!Array.isArray(cids) || cids.length === 0) {
    return res.status(400).json({ error: '`cids` must be a non-empty array.' });
  }
  if (cids.length > 100) {
    return res.status(400).json({ error: 'Maximum 100 CIDs per batch request.' });
  }

  const results = await Promise.allSettled(
    cids.map(async (cid) => {
      const receipt = await findReceiptByCID(cid);
      if (!receipt) return { cid, found: false };

      const hashValid = verifyReceiptHash(receipt);
      const sigValid  = verifyReceiptSignature(receipt, receipt.issuedBy);

      return {
        cid,
        found:          true,
        verified:       hashValid && sigValid,
        hashValid,
        signatureValid: sigValid,
        receiptId:      receipt.receiptId,
        txHash:         receipt.txHash,
        issuedAt:       receipt.issuedAt,
      };
    })
  );

  return res.status(200).json({
    results: results.map((r) =>
      r.status === 'fulfilled' ? r.value : { error: String(r.reason) }
    ),
  });
});

// ─── GET /chain/:agentId ──────────────────────────────────────────────────────

/**
 * Return the last N receipts for a given AP4M agent, in reverse chronological
 * order. Each receipt links to the previous via previousReceiptCid, forming
 * a verifiable chain of custody.
 */
verificationRouter.get('/chain/:agentId', async (req: Request, res: Response) => {
  const { agentId } = req.params;
  const limit  = Math.min(Number(req.query.limit)  || 20, 100);
  const offset = Number(req.query.offset) || 0;

  const receipts = await findReceiptsByPayer(agentId, limit, offset);

  return res.status(200).json({
    agentId,
    count:    receipts.length,
    receipts: receipts.map(r => ({
      cid:               r.cid,
      receiptId:         r.receiptId,
      amount:            r.amount,
      currency:          r.currency,
      protocolId:        r.protocolId,
      paymentType:       r.paymentType,
      blockTimestamp:    r.blockTimestamp,
      previousReceiptCid: r.previousReceiptCid,
      verifyUrl:         `/api/v1/receipts/verify/${r.cid}`,
    })),
  });
});

// ─── POST /webhooks ───────────────────────────────────────────────────────────

const webhookRegistry: Array<{
  url:    string;
  secret: string;
  filter: Partial<Pick<MachinePaymentReceipt, 'protocolId' | 'chain' | 'paymentType'>>;
}> = [];

verificationRouter.post('/webhooks', (req: Request, res: Response) => {
  const { url, secret, filter } = req.body;
  if (!url || !secret) {
    return res.status(400).json({ error: '`url` and `secret` are required.' });
  }
  webhookRegistry.push({ url, secret, filter: filter ?? {} });
  return res.status(201).json({ message: 'Webhook registered.', url });
});

/**
 * Dispatch a receipt-anchored event to all matching webhooks.
 * Call this after a receipt is fully indexed.
 */
export async function dispatchWebhooks(receipt: MachinePaymentReceipt): Promise<void> {
  const { createHmac } = await import('crypto');

  const payload = JSON.stringify({
    event:    'receipt.anchored',
    cid:      receipt.cid,
    receiptId: receipt.receiptId,
    protocolId: receipt.protocolId,
    paymentType: receipt.paymentType,
    chain:    receipt.chain,
    amount:   receipt.amount,
    currency: receipt.currency,
    issuedAt: receipt.issuedAt,
  });

  for (const hook of webhookRegistry) {
    // Apply filter
    const match = Object.entries(hook.filter).every(
      ([k, v]) => (receipt as never as Record<string, unknown>)[k] === v
    );
    if (!match) continue;

    const sig = createHmac('sha256', hook.secret).update(payload).digest('hex');

    fetch(hook.url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'X-Wnode-Signature': sig },
      body:    payload,
    }).catch(e => console.warn(`[webhook] Delivery failed to ${hook.url}:`, e));
  }
}
