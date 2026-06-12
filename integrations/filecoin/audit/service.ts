/**
 * Wnode Audit Layer — Main Orchestrator (WnodeReceiptService)
 *
 * The single entry point for issuing, uploading, indexing, and anchoring
 * M2M payment receipts. All internal modules are called in sequence here.
 *
 * Full pipeline per receipt:
 *   buildPreImage → hash → sign → packCAR → importKubo
 *   → uploadLighthouse → insertIndex → anchorFVM → dispatchWebhooks
 *
 * Feature flag: ENABLE_FILECOIN_RECEIPTS=true
 */

import { buildReceiptPreImage, MachinePaymentReceipt, ReceiptInput } from './core/receipt';
import { hashReceipt }           from './core/hasher';
import { loadSigningKey, signHash, getPublicKeyHex } from './core/signer';
import { packReceiptToCAR, importCARToKubo }         from './storage/car';
import { uploadToLighthouse, StorageRenewalAgent }   from './storage/filecoin';
import {
  ensureSchema,
  insertReceiptIndex,
  getCIDsNeedingRenewal,
}                                from './index/receipt-index';
import { anchorOnFVM }           from './index/receipt-index';
import { dispatchWebhooks }      from './verification';

export * from './verification';   // re-export router for express mounting

// ─── Service ─────────────────────────────────────────────────────────────────

export class WnodeReceiptService {
  private renewalAgent = new StorageRenewalAgent();

  /** Call once at process startup */
  async init(): Promise<void> {
    if (process.env.ENABLE_FILECOIN_RECEIPTS !== 'true') {
      console.log('[WnodeReceiptService] Disabled (ENABLE_FILECOIN_RECEIPTS != true)');
      return;
    }

    loadSigningKey();
    await ensureSchema();
    this.renewalAgent.start(() => getCIDsNeedingRenewal(3));
    console.log('[WnodeReceiptService] Initialized');
  }

  stop(): void { this.renewalAgent.stop(); }

  /**
   * Issue, upload, index, and anchor a single M2M payment receipt.
   *
   * @returns The finalized receipt with cid populated.
   */
  async issue(input: ReceiptInput): Promise<MachinePaymentReceipt> {
    // ── 1. Build pre-image ──────────────────────────────────────────────────
    const preImage = buildReceiptPreImage({
      ...input,
      issuedBy: getPublicKeyHex(),
    });

    // ── 2. Hash (BLAKE3, RFC 8785) ──────────────────────────────────────────
    const { hashBytes, hashHex } = hashReceipt(preImage);

    // ── 3. Sign (Ed25519) ────────────────────────────────────────────────────
    const signature = signHash(hashBytes);

    const signed: Omit<MachinePaymentReceipt, 'cid'> = {
      ...preImage,
      canonicalHash: hashHex,
      signature,
    };

    // ── 4. Pack → CAR (unixfs-v1-2025) ──────────────────────────────────────
    const receipt = signed as MachinePaymentReceipt; // cid will be set next
    const { cid, carBuffer } = await packReceiptToCAR(receipt);
    receipt.cid = cid;

    // ── 5. Import to local Kubo node ─────────────────────────────────────────
    await importCARToKubo(carBuffer, cid).catch(err =>
      console.warn('[WnodeReceiptService] Kubo import non-fatal:', err)
    );

    // ── 6. Upload to Lighthouse → Filecoin deals ────────────────────────────
    const { deals } = await uploadToLighthouse(carBuffer, cid);

    // ── 7. Insert into PostgreSQL index ─────────────────────────────────────
    await insertReceiptIndex(receipt, deals);

    // ── 8. Anchor on Filecoin FVM (async, non-blocking) ─────────────────────
    if (process.env.ENABLE_FVM_ANCHOR === 'true') {
      anchorOnFVM(receipt).catch(err =>
        console.warn('[WnodeReceiptService] FVM anchor non-fatal:', err)
      );
    }

    // ── 9. Dispatch webhooks (async, non-blocking) ───────────────────────────
    dispatchWebhooks(receipt).catch(err =>
      console.warn('[WnodeReceiptService] Webhook dispatch non-fatal:', err)
    );

    console.log(
      `[WnodeReceiptService] Receipt issued | id=${receipt.receiptId}` +
      ` cid=${cid} protocol=${receipt.protocolId} amount=${receipt.amount} ${receipt.currency}`
    );

    return receipt;
  }
}

// ─── Integration: MEV Agent Hook ─────────────────────────────────────────────

/**
 * Called by MEV agents (LiquidationAgent, ArbitrageAgent, etc.)
 * immediately after a successful on-chain execution.
 *
 * Usage (in any sdk.ts):
 *
 *   import { issueReceipt } from '../filecoin/audit/service';
 *   await issueReceipt({ txHash, amount, currency, ... });
 */
export const receiptService = new WnodeReceiptService();

export async function issueReceipt(input: ReceiptInput): Promise<string> {
  if (process.env.ENABLE_FILECOIN_RECEIPTS !== 'true') return '';
  const receipt = await receiptService.issue(input);
  return receipt.cid ?? '';
}
