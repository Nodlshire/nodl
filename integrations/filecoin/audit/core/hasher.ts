/**
 * Wnode Audit Layer — BLAKE3 Hashing Pipeline
 *
 * Implements RFC 8785 (JSON Canonicalization Scheme) over the receipt pre-image,
 * then applies BLAKE3 to produce the canonicalHash.
 *
 * Why BLAKE3 over SHA-256:
 *  - 3–5× faster on modern CPUs (AVX-512 parallelism)
 *  - 256-bit digest (equivalent security to SHA-256)
 *  - Streaming and tree-hashing built-in
 *  - Supported as CIDv1 multihash codec (0x1e)
 *
 * SHA-256 is available via hashReceiptSHA256() for legacy PSP compatibility.
 *
 * Feature flag: ENABLE_FILECOIN_RECEIPTS=true
 */

import { blake3 }    from '@noble/hashes/blake3.js';
import { sha256 }    from '@noble/hashes/sha2.js';
import { MachinePaymentReceipt } from './receipt';

// ─── Canonicalization (RFC 8785) ─────────────────────────────────────────────

/**
 * Deterministically serialize an object:
 *  - Keys sorted alphabetically at every nesting level
 *  - No whitespace
 *  - undefined values omitted
 *  - Numbers encoded as-is (callers must pass strings for monetary amounts)
 *
 * This is a structural implementation of RFC 8785 §3.2.3 (Object Serialization).
 */
export function canonicalize(value: unknown): string {
  if (value === null)              return 'null';
  if (typeof value === 'boolean')  return String(value);
  if (typeof value === 'number')   return JSON.stringify(value);
  if (typeof value === 'string')   return JSON.stringify(value);

  if (Array.isArray(value)) {
    return '[' + value.map(canonicalize).join(',') + ']';
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    const pairs = keys
      .filter(k => obj[k] !== undefined)
      .map(k => `${JSON.stringify(k)}:${canonicalize(obj[k])}`);
    return '{' + pairs.join(',') + '}';
  }

  throw new TypeError(`canonicalize: unsupported type ${typeof value}`);
}

// ─── Pre-image extraction ─────────────────────────────────────────────────────

type PreImage = Omit<MachinePaymentReceipt, 'canonicalHash' | 'signature' | 'cid'>;

/**
 * Strip the fields that are derived *from* the hash so they don't
 * participate in the hash computation.
 */
function extractPreImage(receipt: Partial<MachinePaymentReceipt>): PreImage {
  const { canonicalHash: _ch, signature: _sig, cid: _cid, ...rest } = receipt as MachinePaymentReceipt;
  return rest as PreImage;
}

// ─── BLAKE3 Pipeline ─────────────────────────────────────────────────────────

export interface HashResult {
  canonicalJson: string;    // UTF-8 canonical serialization (for debugging)
  canonicalBytes: Uint8Array;
  hashBytes: Uint8Array;    // 32-byte BLAKE3 digest
  hashHex: string;          // hex-encoded digest (stored as receipt.canonicalHash)
}

/**
 * Hash a receipt pre-image using BLAKE3 over RFC 8785 canonical JSON.
 *
 * @param receipt - Full or partial receipt (canonicalHash/signature/cid ignored)
 */
export function hashReceipt(receipt: Partial<MachinePaymentReceipt>): HashResult {
  const preImage      = extractPreImage(receipt);
  const canonicalJson = canonicalize(preImage);
  const canonicalBytes = new TextEncoder().encode(canonicalJson);
  const hashBytes     = blake3(canonicalBytes);
  const hashHex       = Buffer.from(hashBytes).toString('hex');

  return { canonicalJson, canonicalBytes, hashBytes, hashHex };
}

// ─── SHA-256 Fallback (ISO 20022 / PSP compatibility) ────────────────────────

export function hashReceiptSHA256(receipt: Partial<MachinePaymentReceipt>): HashResult {
  const preImage       = extractPreImage(receipt);
  const canonicalJson  = canonicalize(preImage);
  const canonicalBytes = new TextEncoder().encode(canonicalJson);
  const hashBytes      = sha256(canonicalBytes);
  const hashHex        = Buffer.from(hashBytes).toString('hex');

  return { canonicalJson, canonicalBytes, hashBytes, hashHex };
}

// ─── Verification ─────────────────────────────────────────────────────────────

/**
 * Re-hash a receipt and compare against its stored canonicalHash.
 * Returns true if the hash matches (content not tampered).
 */
export function verifyReceiptHash(receipt: MachinePaymentReceipt): boolean {
  const { hashHex } = hashReceipt(receipt);
  return hashHex === receipt.canonicalHash;
}
