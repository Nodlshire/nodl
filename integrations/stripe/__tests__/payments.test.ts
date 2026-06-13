/**
 * Wnode × Stripe — Payments & Webhooks Test Suite
 *
 * Covers:
 *  - UPO schema validation and creation
 *  - UPO to Stripe PaymentIntent mapping
 *  - Webhook signature verification (HMAC-SHA256)
 *  - Webhook state transitions and invalid rollback blocks
 *  - Idempotency-Key header routing
 *  - Full payment lifecycle integration (mocked fetch)
 */

import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { buildUPO, validateUPO, UniversalPaymentObject } from '../upo';
import { StripeAdapter, PspError }                         from '../payments';
import { verifySignature, processWebhookEvent }             from '../webhook';
import { buildAp4mVerifiableIntent, verifyAp4mIntent }     from '../ap4m-intent';
import { Pool }                                            from 'pg';

vi.mock('pg', () => {
  const query = vi.fn(async () => ({ rows: [] }));
  (globalThis as any).__mockQuery = query;
  return {
    Pool: class {
      query = query;
    },
  };
});

const mockQuery = (globalThis as any).__mockQuery;

// ─── Mock issueReceipt ────────────────────────────────────────────────────────

const mockCid = 'bafyreceipt12345';
const mockHash = 'hash12345';
const mockSig = 'sig12345';

vi.mock('../../filecoin/audit/service', () => ({
  issueReceipt: vi.fn(async () => ({
    cid: mockCid,
    canonicalHash: mockHash,
    signature: mockSig,
    previousReceiptCid: '',
  })),
}));

import { createHmac } from 'crypto';
import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha2.js';

ed.hashes.sha512 = (msg) => sha512(msg);

const privBytes = ed.utils.randomSecretKey();
const pubBytes  = ed.getPublicKey(privBytes);

const NODE_PRIVATE_KEY = Buffer.from(privBytes).toString('hex');
const NODE_PUBLIC_KEY  = Buffer.from(pubBytes).toString('hex');
const NODE_DID         = 'did:ap4m:node-test';

beforeAll(() => {
  process.env.STRIPE_SECRET_KEY   = 'sk_test_123';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_abc';
  process.env.NODE_PUBLIC_KEY_HEX = NODE_PUBLIC_KEY;
  process.env.NODE_PRIVATE_KEY_HEX = NODE_PRIVATE_KEY;
  process.env.WNODE_OPERATOR_ID   = 'operator-abc';
  process.env.DATABASE_URL        = 'postgres://mock';
  process.env.ENABLE_FILECOIN_RECEIPTS = 'true';
});

afterEach(() => {
  vi.clearAllMocks();
});

// ─── 1. UPO Validation ────────────────────────────────────────────────────────

describe('Universal Payment Object (UPO)', () => {
  it('validates a correct UPO', () => {
    const upo = buildUPO({
      idempotency_key:     'idemp-key-1',
      amount_minor_units:  1250, // $12.50
      currency:            'USD',
      source_rail:         'card',
      destination_rail:    'fiat_settlement',
      merchant_account_id: 'acct_123',
      metadata: {
        compute_instance_id: 'instance-xyz',
      },
    });

    const res = validateUPO(upo);
    expect(res.valid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it('rejects UPO with missing compute_instance_id', () => {
    const upo = {
      payment_id:          '6c84b123-90ab-4cde-8f01-23456789abcd',
      idempotency_key:     'idemp-key-1',
      amount_minor_units:  100,
      currency:            'USD',
      source_rail:         'card' as const,
      destination_rail:    'fiat_settlement' as const,
      merchant_account_id: 'acct_123',
      status:              'PENDING' as const,
      metadata:            {}, // missing compute_instance_id
    };

    const res = validateUPO(upo);
    expect(res.valid).toBe(false);
    expect(res.errors).toContain('metadata.compute_instance_id is required');
  });
});

// ─── 2. Stripe Adapter ────────────────────────────────────────────────────────

describe('Stripe Adapter Payments', () => {
  let adapter: StripeAdapter;
  beforeAll(() => {
    adapter = new StripeAdapter();
  });

  it('maps UPO to PaymentIntent creation with correct arguments', async () => {
    const upo = buildUPO({
      idempotency_key:     'idemp-key-1',
      amount_minor_units:  1000,
      currency:            'USD',
      source_rail:         'card',
      destination_rail:    'fiat_settlement',
      merchant_account_id: 'acct_123',
      metadata: {
        compute_instance_id: 'inst-1',
        agent_urn:           'did:agent:1',
      },
    });

    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ id: 'pi_test_123' })));
    globalThis.fetch = mockFetch;

    const res = await adapter.createPayment(upo);

    expect(res.providerPaymentId).toBe('pi_test_123');
    expect(mockFetch).toHaveBeenCalledOnce();

    const callArgs = mockFetch.mock.calls[0];
    const url = callArgs[0] as string;
    const options = callArgs[1] as RequestInit;

    expect(url).toBe('https://api.stripe.com/v1/payment_intents');
    expect(options.method).toBe('POST');
    expect(options.headers).toHaveProperty('Idempotency-Key', upo.idempotency_key);
    expect(options.headers).toHaveProperty('Authorization', `Bearer ${process.env.STRIPE_SECRET_KEY}`);

    const body = options.body as string;
    expect(body).toContain('amount=1000');
    expect(body).toContain('currency=usd');
    expect(body).toContain('capture_method=manual');
    expect(body).toContain('metadata%5Bcompute_instance_id%5D=inst-1');
  });

  it('handles and maps Stripe errors to PspError', async () => {
    const upo = buildUPO({
      idempotency_key:     'idemp-key-2',
      amount_minor_units:  1000,
      currency:            'USD',
      source_rail:         'card',
      destination_rail:    'fiat_settlement',
      merchant_account_id: 'acct_123',
      metadata: { compute_instance_id: 'inst-1' },
    });

    globalThis.fetch = vi.fn(async () => new Response(
      JSON.stringify({
        error: { code: 'parameter_missing', message: 'Missing amount field' },
      }),
      { status: 400 }
    ));

    await expect(adapter.createPayment(upo)).rejects.toThrow(PspError);
  });
});

// ─── 3. Webhook Signature Verification ────────────────────────────────────────

describe('Webhook Signature Verification', () => {
  const secret = 'whsec_abc';

  it('verifies a valid signature matching payload', () => {
    const payload = JSON.stringify({ id: 'evt_123', type: 'payment_intent.succeeded' });
    const timestamp = Math.floor(Date.now() / 1000);

    const signedPayload = `${timestamp}.${payload}`;
    const hmac = createHmac('sha256', secret).update(signedPayload).digest('hex');
    const header = `t=${timestamp},v1=${hmac}`;

    const valid = verifySignature(payload, header, secret);
    expect(valid).toBe(true);
  });

  it('rejects an invalid signature', () => {
    const payload = JSON.stringify({ id: 'evt_123' });
    const header = `t=1234567,v1=invalid_sig`;

    const valid = verifySignature(payload, header, secret);
    expect(valid).toBe(false);
  });

  it('rejects an expired signature (>5 min old)', () => {
    const payload = JSON.stringify({ id: 'evt_123' });
    const timestamp = Math.floor(Date.now() / 1000) - 400; // 400 seconds ago

    const signedPayload = `${timestamp}.${payload}`;
    const hmac = createHmac('sha256', secret).update(signedPayload).digest('hex');
    const header = `t=${timestamp},v1=${hmac}`;

    const valid = verifySignature(payload, header, secret);
    expect(valid).toBe(false);
  });
});

// ─── 4. State Machine transitions ──────────────────────────────────────────────

describe('Webhook State Machine Transitions', () => {
  it('blocks transition from final status to CAPTURED', async () => {
    // Current DB state shows FAILED
    mockQuery.mockResolvedValueOnce({
      rows: [{ status: 'FAILED', receipt_cid: null }],
    } as never);

    const event = {
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_test_123', amount: 1000, currency: 'usd' } },
    };

    await expect(processWebhookEvent(event)).rejects.toThrow(
      'Invalid state transition from FAILED to CAPTURED'
    );
  });

  it('blocks refund transition unless current state is CAPTURED', async () => {
    // Current DB state shows PENDING
    mockQuery.mockResolvedValueOnce({
      rows: [{ status: 'PENDING', receipt_cid: null }],
    } as never);

    const event = {
      type: 'charge.refunded',
      data: { object: { payment_intent: 'pi_test_123', amount_refunded: 1000, currency: 'usd' } },
    };

    await expect(processWebhookEvent(event)).rejects.toThrow(
      'Invalid refund transition from PENDING to REFUNDED'
    );
  });
});

// ─── 5. Full flow integration mock ────────────────────────────────────────────

describe('Stripe Adapter Full Flow Integration', () => {
  let adapter: StripeAdapter;
  beforeAll(() => {
    adapter = new StripeAdapter();
  });

  it('completes capture flow successfully via Stripe', async () => {
    const pi = 'pi_flow_123';

    const mockFetch = vi.fn(async (url: string) => {
      if (url.includes('/capture')) {
        return new Response(JSON.stringify({
          id: pi,
          status: 'succeeded',
        }));
      }
      return new Response(JSON.stringify({ id: pi }));
    });
    globalThis.fetch = mockFetch;

    await expect(adapter.capturePayment(pi)).resolves.not.toThrow();

    const captureCall = mockFetch.mock.calls.find(c => c[0] === `https://api.stripe.com/v1/payment_intents/${pi}/capture`);
    expect(captureCall).toBeTruthy();
  });
});

// ─── 6. AP4M Verifiable Intent ────────────────────────────────────────────────

describe('AP4M Verifiable Intent', () => {
  it('signs and verifies a correct AP4M payment authorization package', async () => {
    const upo = buildUPO({
      idempotency_key:     'idemp-key-ap4m',
      amount_minor_units:  5000, // $50.00
      currency:            'USD',
      source_rail:         'onchain_base',
      destination_rail:    'usdc_settlement',
      merchant_account_id: 'acct_123',
      metadata: {
        compute_instance_id: 'inst-ap4m',
        agent_urn:           'did:agent:ap4m',
      },
    });

    const receipt = {
      cid:           mockCid,
      canonicalHash: mockHash,
      signature:     mockSig,
      schemaVersion: '1.0' as const,
      receiptId:     'uuid',
      payerAgentId:  'payer',
      payeeAgentId:  'payee',
      payerNodeId:   'node1',
      payeeNodeId:   'node2',
      amount:        '50.00',
      currency:      'USDC' as const,
      chain:         'ethereum' as const,
      txHash:        '0x',
      blockNumber:   0,
      blockTimestamp:0,
      contractAddress:'',
      paymentType:   'compute' as const,
      protocolId:    'stripe',
      integrationArchetype: 'Builders' as const,
      issuedAt:      0,
      issuedBy:      NODE_PUBLIC_KEY,
    };

    const intent = await buildAp4mVerifiableIntent(upo, receipt, NODE_PRIVATE_KEY, NODE_DID);

    expect(intent.signature).toBeTruthy();
    expect(intent.signer_did).toBe(NODE_DID);
    expect(intent.envelope.receipt_cid).toBe(mockCid);
    expect(intent.envelope.spend_limit).toBe('50.00');

    const verified = await verifyAp4mIntent(intent, NODE_PUBLIC_KEY);
    expect(verified).toBe(true);
  });
});
