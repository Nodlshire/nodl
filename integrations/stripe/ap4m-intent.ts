/**
 * Wnode × AP4M — Verifiable Intent Structure
 *
 * Implements the Mastercard AP4M-compatible machine payment intent.
 * Signs the intent envelope using the node's Ed25519 keypair, generating a
 * verifiable payment authorization package.
 */

import * as ed from '@noble/ed25519';
import { blake3 } from '@noble/hashes/blake3.js';
import { sha512 } from '@noble/hashes/sha2.js';
import { UniversalPaymentObject } from './upo';
import { MachinePaymentReceipt } from '../filecoin/audit/core/receipt';
import { canonicalize } from '../filecoin/audit/core/hasher';

// noble/ed25519 requires a SHA-512 implementation to be wired in
ed.hashes.sha512 = (msg) => sha512(msg);

// ─── Intent Types ─────────────────────────────────────────────────────────────

export interface Ap4mIntentEnvelope {
  agent_credential:  string;   // DID of the authorizing agent
  spend_limit:       string;   // decimal string in currency unit
  currency:          string;
  rails:             string;   // source rail name (e.g. "onchain_base")
  PSP:               'stripe';
  paymentIntentId:   string;   // Stripe pi_*
  receipt_cid:       string;   // Filecoin IPFS receipt CID
  receipt_hash:      string;   // BLAKE3 hex hash
  timestamp:         number;   // epoch ms
}

export interface Ap4mVerifiableIntent {
  envelope:          Ap4mIntentEnvelope;
  signature:         string;   // Ed25519 signature over envelope (hex)
  signer_did:        string;   // Node DID of the Wnode validator
}

// ─── Builder ──────────────────────────────────────────────────────────────────

/**
 * Construct and sign an AP4M Verifiable Intent using the node's secret key.
 */
export async function buildAp4mVerifiableIntent(
  upo: UniversalPaymentObject,
  receipt: MachinePaymentReceipt,
  nodePrivateKeyHex: string,
  nodeDid: string
): Promise<Ap4mVerifiableIntent> {
  const envelope: Ap4mIntentEnvelope = {
    agent_credential:  upo.metadata.agent_urn ?? 'did:ap4m:unknown-agent',
    spend_limit:       (upo.amount_minor_units / 100).toFixed(2),
    currency:          upo.currency.toUpperCase(),
    rails:             upo.source_rail,
    PSP:               'stripe',
    paymentIntentId:   upo.provider_reference ?? '',
    receipt_cid:       receipt.cid ?? '',
    receipt_hash:      receipt.canonicalHash,
    timestamp:         Date.now()
  };

  // 1. Canonicalize the envelope (guarantees identical bytes for signature verification)
  const canonical = canonicalize(envelope);
  const canonicalBytes = new TextEncoder().encode(canonical);

  // 2. Hash
  const hashBytes = blake3(canonicalBytes);

  // 3. Sign
  const privKeyBytes = Buffer.from(nodePrivateKeyHex, 'hex');
  const sigBytes     = await ed.signAsync(hashBytes, privKeyBytes);
  const signature    = Buffer.from(sigBytes).toString('hex');

  return {
    envelope,
    signature,
    signer_did: nodeDid
  };
}

// ─── Verification ─────────────────────────────────────────────────────────────

/**
 * Verify a Verifiable Intent signature against the node's public key.
 */
export async function verifyAp4mIntent(
  intent: Ap4mVerifiableIntent,
  publicKeyHex: string
): Promise<boolean> {
  try {
    const canonical = canonicalize(intent.envelope);
    const hashBytes = blake3(new TextEncoder().encode(canonical));
    const sigBytes  = Buffer.from(intent.signature, 'hex');
    const pubBytes  = Buffer.from(publicKeyHex, 'hex');

    return await ed.verifyAsync(sigBytes, hashBytes, pubBytes);
  } catch {
    return false;
  }
}
