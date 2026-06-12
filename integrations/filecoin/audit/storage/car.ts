/**
 * Wnode Audit Layer — CAR File Packing + Local Kubo IPFS Import
 *
 * Converts a finalized MachinePaymentReceipt into a CAR (Content-Addressable
 * aRchive) file using the unixfs-v1-2025 profile. The CID is derived locally
 * before any network call, guaranteeing the CID we record in the index is
 * identical to the CID pinned on IPFS nodes.
 *
 * Flow:
 *   1. Serialize receipt → UTF-8 JSON bytes
 *   2. Pack into CAR (ipfs-car, unixfs-v1-2025)  → root CIDv1 (blake3)
 *   3. POST /api/v0/dag/import to local Kubo node → verified pin
 *   4. Return { cid, carBuffer } for upstream Filecoin upload
 *
 * Feature flag: ENABLE_FILECOIN_RECEIPTS=true
 */

import { packToBlob }       from 'ipfs-car/pack/blob';
import { CID }               from 'multiformats/cid';
import { MachinePaymentReceipt } from './receipt';

// ─── Config ───────────────────────────────────────────────────────────────────

const KUBO_RPC   = process.env.KUBO_RPC_URL   ?? 'http://localhost:5001';
const KUBO_TOKEN = process.env.KUBO_RPC_TOKEN  ?? '';

// ─── CAR Packing ─────────────────────────────────────────────────────────────

export interface CARResult {
  cid:       string;     // CIDv1, base32-encoded, blake3 multihash
  carBuffer: Buffer;     // raw CAR bytes (for upload to Lighthouse)
  byteSize:  number;     // receipt byte size (for cost accounting)
}

/**
 * Pack a receipt JSON into a CAR file and compute its CIDv1.
 *
 * Uses the unixfs-v1-2025 profile:
 *  - 1 MiB chunk size
 *  - 1024 links per node (shallower, faster DAG)
 *  - blake3 as the multihash function
 *
 * The CID is deterministic: identical receipt bytes → identical CID, always.
 */
export async function packReceiptToCAR(receipt: MachinePaymentReceipt): Promise<CARResult> {
  const json        = JSON.stringify(receipt);        // full receipt with all fields
  const receiptBytes = new TextEncoder().encode(json);
  const filename    = `${receipt.receiptId}.json`;

  const { root, car } = await packToBlob({
    input: [{ path: filename, content: receiptBytes }],
    wrapWithDirectory: false,
    // unixfs-v1-2025 settings
    maxChunkSize: 1_048_576,          // 1 MiB
    maxChildrenPerNode: 1024,
    hasher: 'blake3',                 // CIDv1 with blake3 multihash (0x1e)
    rawLeaves: true,
  });

  const carBlob   = await car.arrayBuffer();
  const carBuffer = Buffer.from(carBlob);
  const cid       = root.toString();  // base32 CIDv1

  return { cid, carBuffer, byteSize: receiptBytes.byteLength };
}

// ─── CID Verification ─────────────────────────────────────────────────────────

/**
 * Re-pack a receipt and verify the resulting CID matches the stored one.
 * Fails if the receipt content was modified after issuance.
 */
export async function verifyCIDIntegrity(receipt: MachinePaymentReceipt): Promise<boolean> {
  if (!receipt.cid) return false;
  const { cid: recomputed } = await packReceiptToCAR(receipt);
  return recomputed === receipt.cid;
}

// ─── Kubo Local Node Import ───────────────────────────────────────────────────

export interface KuboImportResult {
  cid:     string;
  pinned:  boolean;
}

/**
 * Import a CAR file into the local Kubo IPFS node via the RPC API.
 *
 * POST /api/v0/dag/import
 * The node will validate the DAG and confirm the root CID matches.
 * We also pin the root so it is not garbage-collected.
 */
export async function importCARToKubo(
  carBuffer: Buffer,
  expectedCid: string,
): Promise<KuboImportResult> {
  // 1. Import DAG
  const formData = new FormData();
  formData.append('file', new Blob([carBuffer], { type: 'application/vnd.ipld.car' }));

  const importRes = await fetch(`${KUBO_RPC}/api/v0/dag/import`, {
    method:  'POST',
    headers: KUBO_TOKEN ? { Authorization: `Bearer ${KUBO_TOKEN}` } : {},
    body:    formData,
  });

  if (!importRes.ok) {
    throw new Error(`[kubo] dag/import failed: ${importRes.status} ${await importRes.text()}`);
  }

  const importData = await importRes.json() as { Root: { Cid: { '/': string } } };
  const returnedCid = importData?.Root?.Cid?.['/'];

  if (returnedCid !== expectedCid) {
    throw new Error(
      `[kubo] CID mismatch: expected ${expectedCid}, got ${returnedCid}`
    );
  }

  // 2. Explicit pin (belt-and-suspenders — dag/import should auto-pin)
  const pinRes = await fetch(
    `${KUBO_RPC}/api/v0/pin/add?arg=${expectedCid}&recursive=true`,
    {
      method:  'POST',
      headers: KUBO_TOKEN ? { Authorization: `Bearer ${KUBO_TOKEN}` } : {},
    }
  );

  const pinned = pinRes.ok;

  console.log(`[kubo] Imported receipt CID ${expectedCid} (pinned=${pinned})`);
  return { cid: expectedCid, pinned };
}
