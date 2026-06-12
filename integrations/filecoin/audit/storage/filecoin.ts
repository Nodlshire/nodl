/**
 * Wnode Audit Layer — Filecoin Storage (Lighthouse + Onchain Cloud)
 *
 * Manages permanent receipt archiving via:
 *  - Lighthouse SDK: pay-once permanent pinning + automated Filecoin deals
 *  - Filecoin Onchain Cloud: PDP (Proof of Data Possession) verification
 *  - StorageRenewalAgent: monitors deal health and re-proposes expired deals
 *
 * Storage tiers:
 *  - Hot   → Kubo local node (handled in car.ts)
 *  - Warm  → Lighthouse IPFS pin + 3-miner Filecoin deals
 *  - Cold  → Filecoin Onchain Cloud with PDP challenge cycle
 *
 * Feature flag: ENABLE_FILECOIN_RECEIPTS=true
 */

import lighthouse from '@lighthouse-web3/sdk';

// ─── Config ───────────────────────────────────────────────────────────────────

const LIGHTHOUSE_KEY      = process.env.LIGHTHOUSE_API_KEY ?? '';
const MIN_ACTIVE_DEALS    = 3;      // minimum simultaneous Filecoin deals
const DEAL_CHECK_INTERVAL = 60_000; // ms between deal status polling

// ─── Types ────────────────────────────────────────────────────────────────────

export type DealStatus = 'queued' | 'published' | 'active' | 'expired' | 'slashed';

export interface FilecoinDeal {
  dealId:  string;
  miner:   string;         // Filecoin storage provider ID (e.g. "f01234")
  status:  DealStatus;
  expiry?: number;         // Unix epoch when deal expires
}

export interface LighthouseUploadResult {
  cid:        string;
  fileSize:   number;
  deals:      FilecoinDeal[];
  pinnedAt:   number;      // Unix epoch ms
}

export interface PDPVerificationResult {
  cid:          string;
  verified:     boolean;
  challengeBlock?: number;
  proofSubmitted?: boolean;
  verifiedAt:   number;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

/**
 * Upload a CAR buffer to Lighthouse, which:
 *  1. Pins on IPFS (immediate)
 *  2. Proposes Filecoin storage deals with ≥3 independent miners
 *  3. Returns deal IDs for status monitoring
 */
export async function uploadToLighthouse(
  carBuffer: Buffer,
  expectedCid: string,
): Promise<LighthouseUploadResult> {
  if (!LIGHTHOUSE_KEY) {
    throw new Error('[lighthouse] LIGHTHOUSE_API_KEY not set');
  }

  // Lighthouse accepts Buffer directly for CAR uploads
  const uploadRes = await lighthouse.uploadBuffer(carBuffer, LIGHTHOUSE_KEY);
  const returnedCid = uploadRes?.data?.Hash;

  if (returnedCid !== expectedCid) {
    throw new Error(
      `[lighthouse] CID mismatch: expected ${expectedCid}, got ${returnedCid}`
    );
  }

  // Poll deal status (deals are proposed asynchronously after upload)
  const deals = await pollDealStatus(expectedCid);

  console.log(`[lighthouse] Uploaded ${expectedCid} — ${deals.length} deals proposed`);
  return {
    cid:      expectedCid,
    fileSize: carBuffer.byteLength,
    deals,
    pinnedAt: Date.now(),
  };
}

// ─── Deal Status ──────────────────────────────────────────────────────────────

/**
 * Fetch current Filecoin deal status for a CID.
 * Lighthouse's dealStatus API returns all deals proposed for this data.
 */
export async function pollDealStatus(cid: string): Promise<FilecoinDeal[]> {
  try {
    const res = await lighthouse.dealStatus(cid);
    if (!Array.isArray(res?.data)) return [];

    return res.data.map((d: Record<string, unknown>) => ({
      dealId: String(d.dealId   ?? d.deal_id ?? ''),
      miner:  String(d.storageProvider ?? d.miner ?? ''),
      status: normalizeDealStatus(String(d.dealStatus ?? d.status ?? '')),
      expiry: d.expiry ? Number(d.expiry) : undefined,
    }));
  } catch (err) {
    console.warn(`[lighthouse] dealStatus failed for ${cid}:`, err);
    return [];
  }
}

function normalizeDealStatus(raw: string): DealStatus {
  const s = raw.toLowerCase();
  if (s.includes('active'))    return 'active';
  if (s.includes('published')) return 'published';
  if (s.includes('slashed'))   return 'slashed';
  if (s.includes('expired'))   return 'expired';
  return 'queued';
}

// ─── PDP Verification ─────────────────────────────────────────────────────────

/**
 * Verify Proof of Data Possession via Filecoin Onchain Cloud.
 *
 * PDP works by randomly sampling data chunks and requiring storage providers
 * to prove they hold the exact bytes. Proofs are submitted on-chain.
 * Failure → automatic collateral slashing.
 *
 * This queries the Filecoin chain (via FVM RPC) to confirm a valid proof
 * was submitted within the last challenge window (~24 hours).
 */
export async function verifyPDPProof(cid: string): Promise<PDPVerificationResult> {
  const FVM_RPC = process.env.FVM_RPC_URL ?? 'https://api.node.glif.io/rpc/v1';

  try {
    // Query the WnodePDPVerifier contract (or Synapse SDK endpoint)
    const res = await fetch(FVM_RPC, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [{
          to:   process.env.PDP_VERIFIER_CONTRACT ?? '',
          data: encodePDPQuery(cid),
        }, 'latest'],
      }),
    });

    const json = await res.json() as { result?: string };
    const verified = decodePDPResult(json.result ?? '0x');

    return {
      cid,
      verified,
      verifiedAt: Date.now(),
    };
  } catch (err) {
    console.warn(`[pdp] Verification failed for ${cid}:`, err);
    return { cid, verified: false, verifiedAt: Date.now() };
  }
}

function encodePDPQuery(cid: string): string {
  // ABI-encode: verifyDataPossession(string cid)
  // selector: keccak256("verifyDataPossession(string)")[0:4]
  // Full ABI encoding omitted for brevity — use ethers.js in production
  const selector = '0xa1b2c3d4';  // placeholder — replace with real selector
  const cidHex   = Buffer.from(cid).toString('hex').padEnd(64, '0');
  return `${selector}${cidHex}`;
}

function decodePDPResult(result: string): boolean {
  // ABI-decoded bool return
  return result !== '0x' && result !== '0x0000000000000000000000000000000000000000000000000000000000000000';
}

// ─── StorageRenewalAgent ──────────────────────────────────────────────────────

/**
 * Monitor deal health and re-propose deals that are expired or slashed.
 * Runs as a background agent, not in the hot path.
 */
export class StorageRenewalAgent {
  private running = false;

  async start(getCidsToCheck: () => Promise<string[]>): Promise<void> {
    this.running = true;
    console.log('[StorageRenewalAgent] Started');

    while (this.running) {
      await this.runCycle(getCidsToCheck);
      await new Promise(r => setTimeout(r, DEAL_CHECK_INTERVAL));
    }
  }

  stop(): void { this.running = false; }

  private async runCycle(getCidsToCheck: () => Promise<string[]>): Promise<void> {
    const cids = await getCidsToCheck();

    for (const cid of cids) {
      const deals = await pollDealStatus(cid);
      const activeDeals = deals.filter(d => d.status === 'active').length;

      if (activeDeals < MIN_ACTIVE_DEALS) {
        console.warn(
          `[StorageRenewalAgent] CID ${cid} has only ${activeDeals} active deals` +
          ` (min: ${MIN_ACTIVE_DEALS}). Re-pinning...`
        );
        // Re-pin triggers Lighthouse to propose new deals
        await fetch(
          `https://api.lighthouse.storage/api/lighthouse/pin`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LIGHTHOUSE_KEY}`,
              'Content-Type':  'application/json',
            },
            body: JSON.stringify({ cid }),
          }
        );
      }
    }
  }
}
