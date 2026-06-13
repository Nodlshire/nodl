/**
 * Wnode Audit Layer — Test Suite
 *
 * Covers:
 *  1. Receipt schema factory
 *  2. BLAKE3 + RFC 8785 canonical hash determinism
 *  3. SHA-256 fallback
 *  4. Ed25519 sign + verify roundtrip
 *  5. Tamper detection (hash mismatch, signature mismatch)
 *  6. CAR packing CID determinism
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { buildReceiptPreImage, ReceiptInput } from '../core/receipt';
import { hashReceipt, verifyReceiptHash, hashReceiptSHA256 } from '../core/hasher';
import { generateKeypair, signHash, verifyReceiptSignature, loadSigningKey } from '../core/signer';
import { verifyCIDIntegrity, packReceiptToCAR } from '../storage/car';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const baseInput: ReceiptInput = {
  payerAgentId:        'did:ap4m:agent:0xPAYER',
  payeeAgentId:        'did:ap4m:agent:0xPAYEE',
  payerNodeId:         'wuid-node-a',
  payeeNodeId:         'wuid-node-b',
  amount:              '1234.567890',
  currency:            'GHO',
  chain:               'ethereum',
  txHash:              '0xabc123',
  blockNumber:         21_000_000,
  blockTimestamp:      1_749_731_516,
  contractAddress:     '0xAave',
  paymentType:         'liquidation',
  protocolId:          'aave-v4',
  integrationArchetype: 'Lending',
  issuedBy:            'pubkey-placeholder',
};

let keypair: { privateKeyHex: string; publicKeyHex: string };

beforeAll(() => {
  keypair = generateKeypair();
  process.env.NODE_PRIVATE_KEY_HEX = keypair.privateKeyHex;
  process.env.NODE_PUBLIC_KEY_HEX = keypair.publicKeyHex;
  loadSigningKey();
});

// ─── 1. Receipt Schema ────────────────────────────────────────────────────────

describe('Receipt Schema', () => {
  it('produces deterministic receiptId-less pre-image fields', () => {
    const preImage = buildReceiptPreImage({ ...baseInput, issuedBy: keypair.publicKeyHex });
    expect(preImage.schemaVersion).toBe('1.0');
    expect(preImage.amount).toBe('1234.567890');
    expect(typeof preImage.issuedAt).toBe('number');
    expect(preImage.issuedAt).toBeGreaterThan(0);
  });

  it('assigns a valid UUID receiptId', () => {
    const preImage = buildReceiptPreImage(baseInput);
    expect(preImage.receiptId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it('includes MEV bundle context when provided', () => {
    const preImage = buildReceiptPreImage({
      ...baseInput,
      mevBundle: { bundleId: 'b1', builder: 'flashbots', priorityFeeGwei: '5', bundleProfit: '0.12' },
    });
    expect(preImage.mevBundle?.builder).toBe('flashbots');
  });
});

// ─── 2. BLAKE3 Hash Determinism ───────────────────────────────────────────────

describe('BLAKE3 Hashing (RFC 8785)', () => {
  it('produces identical hashes for identical pre-images', () => {
    const p = buildReceiptPreImage(baseInput);
    // Override issuedAt to be deterministic
    (p as { issuedAt: number }).issuedAt = 1_000_000_000_000;

    const r1 = hashReceipt(p);
    const r2 = hashReceipt(p);
    expect(r1.hashHex).toBe(r2.hashHex);
  });

  it('produces different hashes when amount changes', () => {
    const p1 = buildReceiptPreImage(baseInput);
    const p2 = buildReceiptPreImage({ ...baseInput, amount: '9999.999' });
    (p1 as { issuedAt: number }).issuedAt = 1_000_000_000_000;
    (p2 as { issuedAt: number }).issuedAt = 1_000_000_000_000;
    (p2 as { receiptId: string }).receiptId = (p1 as { receiptId: string }).receiptId;

    const r1 = hashReceipt(p1);
    const r2 = hashReceipt(p2);
    expect(r1.hashHex).not.toBe(r2.hashHex);
  });

  it('hash is 64 hex chars (32 bytes)', () => {
    const p = buildReceiptPreImage(baseInput);
    const r = hashReceipt(p);
    expect(r.hashHex).toHaveLength(64);
    expect(r.hashHex).toMatch(/^[0-9a-f]+$/);
  });

  it('SHA-256 fallback produces a different hash from BLAKE3', () => {
    const p = buildReceiptPreImage(baseInput);
    (p as { issuedAt: number }).issuedAt = 1_000_000_000_000;
    const blake3 = hashReceipt(p).hashHex;
    const sha256 = hashReceiptSHA256(p).hashHex;
    expect(blake3).not.toBe(sha256);
    expect(sha256).toHaveLength(64);
  });
});

// ─── 3. Ed25519 Sign + Verify ─────────────────────────────────────────────────

describe('Ed25519 Signing', () => {
  it('verifies a valid signature', () => {
    const p = buildReceiptPreImage({ ...baseInput, issuedBy: keypair.publicKeyHex });
    const { hashBytes, hashHex } = hashReceipt(p);
    const sig = signHash(hashBytes);

    const receipt = {
      ...p,
      canonicalHash: hashHex,
      signature:     sig,
    } as Parameters<typeof verifyReceiptSignature>[0];

    expect(verifyReceiptSignature(receipt, keypair.publicKeyHex)).toBe(true);
  });

  it('rejects a tampered signature', () => {
    const p = buildReceiptPreImage({ ...baseInput, issuedBy: keypair.publicKeyHex });
    const { hashBytes, hashHex } = hashReceipt(p);
    const sig = signHash(hashBytes);

    const tampered = {
      ...p,
      canonicalHash: hashHex,
      signature:     sig.replace(/^[0-9a-f]/, (c) => c === '0' ? '1' : '0'), // corrupt first char
    } as Parameters<typeof verifyReceiptSignature>[0];

    expect(verifyReceiptSignature(tampered, keypair.publicKeyHex)).toBe(false);
  });

  it('rejects a signature from a different key', () => {
    const other = generateKeypair();
    const p = buildReceiptPreImage({ ...baseInput, issuedBy: keypair.publicKeyHex });
    const { hashBytes, hashHex } = hashReceipt(p);

    // Sign with main key, verify with other key
    const sig = signHash(hashBytes);
    const receipt = { ...p, canonicalHash: hashHex, signature: sig } as Parameters<typeof verifyReceiptSignature>[0];

    expect(verifyReceiptSignature(receipt, other.publicKeyHex)).toBe(false);
  });
});

// ─── 4. Tamper Detection ──────────────────────────────────────────────────────

describe('Tamper Detection', () => {
  it('detects content modification via hash mismatch', () => {
    const p = buildReceiptPreImage(baseInput);
    const { hashHex } = hashReceipt(p);

    const receipt = {
      ...p,
      amount:        '0.000001',   // tampered!
      canonicalHash: hashHex,      // original hash
      signature:     'sig',
    } as Parameters<typeof verifyReceiptHash>[0];

    expect(verifyReceiptHash(receipt)).toBe(false);
  });
});

// ─── 5. CAR CID Determinism ───────────────────────────────────────────────────

describe('CAR Packing + CID', () => {
  it('produces the same CID for identical receipt content', async () => {
    const p = buildReceiptPreImage({ ...baseInput, issuedBy: keypair.publicKeyHex });
    (p as { issuedAt: number }).issuedAt = 1_000_000_000_000;
    const { hashBytes, hashHex } = hashReceipt(p);
    const sig = signHash(hashBytes);
    const receipt = { ...p, canonicalHash: hashHex, signature: sig } as Parameters<typeof packReceiptToCAR>[0];

    const r1 = await packReceiptToCAR(receipt);
    const r2 = await packReceiptToCAR(receipt);
    expect(r1.cid).toBe(r2.cid);
  });

  it('CID is a valid base32 CIDv1 string', async () => {
    const p = buildReceiptPreImage(baseInput);
    const { hashBytes, hashHex } = hashReceipt(p);
    const sig = signHash(hashBytes);
    const receipt = { ...p, canonicalHash: hashHex, signature: sig } as Parameters<typeof packReceiptToCAR>[0];
    const { cid } = await packReceiptToCAR(receipt);
    expect(cid).toMatch(/^baf[ky]/); // base32 CIDv1 prefix
  });

  it('verifyCIDIntegrity confirms unmodified receipt', async () => {
    const p = buildReceiptPreImage(baseInput);
    const { hashBytes, hashHex } = hashReceipt(p);
    const sig = signHash(hashBytes);
    const receipt = { ...p, canonicalHash: hashHex, signature: sig } as Parameters<typeof packReceiptToCAR>[0];
    const { cid } = await packReceiptToCAR(receipt);
    receipt.cid = cid;

    const ok = await verifyCIDIntegrity(receipt as Parameters<typeof verifyCIDIntegrity>[0]);
    expect(ok).toBe(true);
  });

  it('verifyCIDIntegrity rejects modified receipt', async () => {
    const p = buildReceiptPreImage(baseInput);
    const { hashBytes, hashHex } = hashReceipt(p);
    const sig = signHash(hashBytes);
    const receipt = { ...p, canonicalHash: hashHex, signature: sig } as Parameters<typeof packReceiptToCAR>[0];
    const { cid } = await packReceiptToCAR(receipt);
    receipt.cid = cid;

    // Tamper the receipt content after CID was computed
    (receipt as { amount: string }).amount = '0.000001';

    const ok = await verifyCIDIntegrity(receipt as Parameters<typeof verifyCIDIntegrity>[0]);
    expect(ok).toBe(false);
  });
});
