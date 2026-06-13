/**
 * Wnode Audit Layer — Ed25519 Signing Pipeline
 *
 * Signs the BLAKE3 canonicalHash of each receipt using the issuing Wnode
 * node's Ed25519 private key. Signatures are deterministic (RFC 8032).
 *
 * Key management:
 *  - Private key loaded once from environment / HSM at startup.
 *  - Public key registered in the Wnode node registry on-chain.
 *  - Key rotation: old public keys remain valid for historical receipt verification.
 *
 * Feature flag: ENABLE_FILECOIN_RECEIPTS=true
 */

import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha2.js';
import { MachinePaymentReceipt } from './receipt';

// noble/ed25519 requires a SHA-512 implementation to be wired in
ed.hashes.sha512 = (msg) => sha512(msg);

// ─── Key Loading ──────────────────────────────────────────────────────────────

let _privateKey: Uint8Array | null = null;
let _publicKey:  Uint8Array | null = null;

/**
 * Load the node signing key from environment variables.
 * Call once at service startup.
 *
 * NODE_PRIVATE_KEY_HEX — 64-hex-char Ed25519 seed
 * NODE_PUBLIC_KEY_HEX  — 64-hex-char Ed25519 public key
 */
export function loadSigningKey(): void {
  const priv = process.env.NODE_PRIVATE_KEY_HEX;
  const pub  = process.env.NODE_PUBLIC_KEY_HEX;

  if (!priv || !pub) {
    throw new Error('[signer] NODE_PRIVATE_KEY_HEX / NODE_PUBLIC_KEY_HEX not set');
  }

  _privateKey = Buffer.from(priv, 'hex');
  _publicKey  = Buffer.from(pub,  'hex');
}

function getPrivateKey(): Uint8Array {
  if (!_privateKey) throw new Error('[signer] Signing key not loaded. Call loadSigningKey() first.');
  return _privateKey;
}

export function getPublicKeyHex(): string {
  if (!_publicKey) throw new Error('[signer] Signing key not loaded. Call loadSigningKey() first.');
  return Buffer.from(_publicKey).toString('hex');
}

// ─── Signing ─────────────────────────────────────────────────────────────────

/**
 * Sign the BLAKE3 hash bytes of a receipt.
 *
 * @param hashBytes - 32-byte BLAKE3 digest (from hasher.hashReceipt)
 * @returns hex-encoded Ed25519 signature (128 hex chars = 64 bytes)
 */
export function signHash(hashBytes: Uint8Array): string {
  const sig = ed.sign(hashBytes, getPrivateKey());
  return Buffer.from(sig).toString('hex');
}

// ─── Verification ─────────────────────────────────────────────────────────────

/**
 * Verify an Ed25519 signature against the receipt's canonicalHash.
 *
 * @param receipt     - Full receipt including canonicalHash and signature
 * @param publicKeyHex - The issuing node's registered public key (hex)
 */
export function verifyReceiptSignature(
  receipt: MachinePaymentReceipt,
  publicKeyHex: string,
): boolean {
  try {
    const hashBytes = Buffer.from(receipt.canonicalHash, 'hex');
    const sigBytes  = Buffer.from(receipt.signature,    'hex');
    const pubBytes  = Buffer.from(publicKeyHex,         'hex');

    return ed.verify(sigBytes, hashBytes, pubBytes);
  } catch {
    return false;
  }
}

// ─── Key Derivation (Testing / Dev Only) ─────────────────────────────────────

/**
 * Generate a fresh Ed25519 keypair.
 * For testing and initial node provisioning only — never call in production hot path.
 */
export function generateKeypair(): { privateKeyHex: string; publicKeyHex: string } {
  const privBytes = ed.utils.randomSecretKey();
  const pubBytes  = ed.getPublicKey(privBytes);
  return {
    privateKeyHex: Buffer.from(privBytes).toString('hex'),
    publicKeyHex:  Buffer.from(pubBytes).toString('hex'),
  };
}
