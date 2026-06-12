/**
 * Wnode M2M Payment Receipt — Canonical Schema
 *
 * Every machine-to-machine payment settled through Wnode produces one receipt.
 * The schema is deterministic: keys are sorted (RFC 8785), no floats, no
 * undefined fields. Identical inputs always produce identical bytes → identical CIDs.
 *
 * Feature flag: ENABLE_FILECOIN_RECEIPTS=true
 */

import { randomUUID } from 'crypto';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Chain =
  | 'ethereum' | 'arbitrum' | 'optimism' | 'base'
  | 'polygon'  | 'avalanche' | 'solana'   | 'filecoin';

export type Currency = 'GHO' | 'USDC' | 'USDT' | 'ETH' | 'SOL' | 'FIL';

export type PaymentType =
  | 'liquidation' | 'relay'   | 'keeper'
  | 'arb'         | 'treasury' | 'compute';

export type Archetype =
  | 'Lending' | 'SpotDEX' | 'Perps'
  | 'Bridges' | 'Oracles'  | 'Builders';

export type Builder = 'flashbots' | 'jito' | 'skip' | 'public';

export interface MEVBundleContext {
  bundleId:        string;
  builder:         Builder;
  priorityFeeGwei: string;  // decimal string
  bundleProfit:    string;  // decimal string, in currency units
}

/**
 * MachinePaymentReceipt — the canonical audit record for every M2M settlement.
 *
 * Fields excluded from the canonicalHash input (they are derived/added after):
 *   - canonicalHash
 *   - signature
 *   - cid  (added after IPFS upload)
 */
export interface MachinePaymentReceipt {
  // ── Schema ──────────────────────────────────────────────────────────────
  schemaVersion:  '1.0';

  // ── Identification ───────────────────────────────────────────────────────
  receiptId:      string;   // UUID v4

  // ── Parties ──────────────────────────────────────────────────────────────
  payerAgentId:   string;   // AP4M Verifiable Intent DID
  payeeAgentId:   string;   // AP4M Verifiable Intent DID
  payerNodeId:    string;   // Wnode operator WUID
  payeeNodeId:    string;   // Wnode operator WUID

  // ── Payment ──────────────────────────────────────────────────────────────
  amount:         string;   // Exact decimal string — never a JS number
  currency:       Currency;
  chain:          Chain;
  txHash:         string;   // On-chain transaction hash (0x-prefixed or base58)
  blockNumber:    number;
  blockTimestamp: number;   // Unix epoch, seconds
  contractAddress:string;   // Settlement contract or token address

  // ── Classification ───────────────────────────────────────────────────────
  paymentType:       PaymentType;
  protocolId:        string;    // e.g. "aave-v4", "gmx-v2", "wormhole"
  integrationArchetype: Archetype;

  // ── MEV Context (optional) ────────────────────────────────────────────────
  mevBundle?: MEVBundleContext;

  // ── Chain Linking ─────────────────────────────────────────────────────────
  previousReceiptCid?: string;  // CID of prior receipt for this payerAgentId

  // ── Audit Fields (set by WnodeReceiptService) ────────────────────────────
  issuedAt:       number;   // Unix epoch, milliseconds
  issuedBy:       string;   // Wnode node Ed25519 public key (hex)

  // ── Integrity (set after hashing) ────────────────────────────────────────
  canonicalHash:  string;   // BLAKE3 over canonicalized pre-image (hex)
  signature:      string;   // Ed25519 sig over canonicalHash bytes (hex)

  // ── Content Addressing (set after IPFS upload) ───────────────────────────
  cid?:           string;   // CIDv1 (base32, blake3 multihash)
}

// ─── Factory ─────────────────────────────────────────────────────────────────

export interface ReceiptInput {
  payerAgentId:        string;
  payeeAgentId:        string;
  payerNodeId:         string;
  payeeNodeId:         string;
  amount:              string;
  currency:            Currency;
  chain:               Chain;
  txHash:              string;
  blockNumber:         number;
  blockTimestamp:      number;
  contractAddress:     string;
  paymentType:         PaymentType;
  protocolId:          string;
  integrationArchetype:Archetype;
  mevBundle?:          MEVBundleContext;
  previousReceiptCid?: string;
  issuedBy:            string;  // node public key hex
}

/**
 * Build a receipt pre-image (no canonicalHash / signature / cid yet).
 * Caller must pass this to the hasher then the signer.
 */
export function buildReceiptPreImage(
  input: ReceiptInput,
): Omit<MachinePaymentReceipt, 'canonicalHash' | 'signature' | 'cid'> {
  return {
    schemaVersion:        '1.0',
    receiptId:            randomUUID(),
    payerAgentId:         input.payerAgentId,
    payeeAgentId:         input.payeeAgentId,
    payerNodeId:          input.payerNodeId,
    payeeNodeId:          input.payeeNodeId,
    amount:               input.amount,
    currency:             input.currency,
    chain:                input.chain,
    txHash:               input.txHash,
    blockNumber:          input.blockNumber,
    blockTimestamp:       input.blockTimestamp,
    contractAddress:      input.contractAddress,
    paymentType:          input.paymentType,
    protocolId:           input.protocolId,
    integrationArchetype: input.integrationArchetype,
    ...(input.mevBundle          && { mevBundle: input.mevBundle }),
    ...(input.previousReceiptCid && { previousReceiptCid: input.previousReceiptCid }),
    issuedAt:             Date.now(),
    issuedBy:             input.issuedBy,
  };
}
