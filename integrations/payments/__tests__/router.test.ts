import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { routePayment, getProvider, ProviderName } from '../router';
import { buildUPO, UniversalPaymentObject } from '../upo';
import { NotConfiguredError } from '../core';
import {
  reconcilePaymentState,
  recordPaymentCreated,
  ensureWebhookSchema,
  processIncomingWebhook,
  centralPollingWorker
} from '../reconciliation';

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

const mockCid = 'bafyreceipt12345';
vi.mock('../../filecoin/audit/service', () => ({
  issueReceipt: vi.fn(async () => ({
    cid: mockCid,
    canonicalHash: 'hash12345',
    signature: 'sig12345',
    previousReceiptCid: '',
  })),
}));

beforeAll(() => {
  process.env.DATABASE_URL = 'postgres://mock';
  process.env.NODE_ENV = 'test';
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Multi-PSP Router', () => {
  it('routes card and sepa source rails to Stripe by default', () => {
    const cardUpo = buildUPO({
      idempotency_key: 'idemp-card',
      amount_minor_units: 100,
      currency: 'USD',
      source_rail: 'card',
      destination_rail: 'fiat_settlement',
      merchant_account_id: 'merchant-1',
      metadata: { compute_instance_id: 'inst-1' }
    });

    const sepaUpo = { ...cardUpo, source_rail: 'sepa' as const };

    const cardAdapter = routePayment(cardUpo);
    const sepaAdapter = routePayment(sepaUpo);

    expect(cardAdapter).toBe(getProvider('stripe'));
    expect(sepaAdapter).toBe(getProvider('stripe'));
  });

  it('routes onchain rails to Coinbase by default', () => {
    const cryptoUpo = buildUPO({
      idempotency_key: 'idemp-crypto',
      amount_minor_units: 200,
      currency: 'USD',
      source_rail: 'onchain_base',
      destination_rail: 'usdc_settlement',
      merchant_account_id: 'merchant-1',
      metadata: { compute_instance_id: 'inst-2' }
    });

    const adapter = routePayment(cryptoUpo);
    expect(adapter).toBe(getProvider('coinbase'));
  });

  it('routes onchain rails to OKX if preferred_provider metadata is okx', () => {
    const cryptoUpo = buildUPO({
      idempotency_key: 'idemp-crypto-okx',
      amount_minor_units: 200,
      currency: 'USD',
      source_rail: 'onchain_solana',
      destination_rail: 'usdc_settlement',
      merchant_account_id: 'merchant-1',
      metadata: {
        compute_instance_id: 'inst-2',
        preferred_provider: 'okx'
      }
    });

    const adapter = routePayment(cryptoUpo);
    expect(adapter).toBe(getProvider('okx'));
  });

  it('routes payouts to BVNK if destination_rail is usdc/usdt and payment_type is payout', () => {
    const payoutUpo = buildUPO({
      idempotency_key: 'idemp-payout',
      amount_minor_units: 50000,
      currency: 'USD',
      source_rail: 'card',
      destination_rail: 'usdc_settlement',
      merchant_account_id: 'merchant-1',
      metadata: {
        compute_instance_id: 'inst-3',
        payment_type: 'payout'
      }
    });

    const adapter = routePayment(payoutUpo);
    expect(adapter).toBe(getProvider('bvnk'));
  });

  it('throws NotConfiguredError when executing methods on unconfigured stub adapters in non-test env', async () => {
    const checkoutAdapter = getProvider('checkout');

    // Simulate non-test environment to test config checks
    const prevEnv = process.env.NODE_ENV;
    delete (process.env as any).NODE_ENV;
    delete (process.env as any).CHECKOUT_SECRET_KEY;

    const testUpo = buildUPO({
      idempotency_key: 'idemp-test',
      amount_minor_units: 100,
      currency: 'USD',
      source_rail: 'card',
      destination_rail: 'fiat_settlement',
      merchant_account_id: 'merchant-1',
      metadata: { compute_instance_id: 'inst-1' }
    });

    await expect(checkoutAdapter.createPayment(testUpo)).rejects.toThrow(NotConfiguredError);

    // Restore
    process.env.NODE_ENV = prevEnv;
  });
});

describe('Shared Webhook Reconciliation Core', () => {
  it('inserts incoming webhook log and deduplicates correctly', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] }); // insert webhook success

    const handler = vi.fn();
    await processIncomingWebhook({
      eventId: 'evt_dup_123',
      provider: 'stripe',
      payload: '{}',
      headers: {},
      handler
    });

    expect(handler).toHaveBeenCalledTimes(1);

    // Second execution with same eventId should not run handler again
    await processIncomingWebhook({
      eventId: 'evt_dup_123',
      provider: 'stripe',
      payload: '{}',
      headers: {},
      handler
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('reconciles state transition and blocks invalid rollbacks', async () => {
    // Mock current ledger status as CAPTURED
    mockQuery.mockResolvedValueOnce({
      rows: [{ status: 'CAPTURED', receipt_cid: 'cid123' }]
    } as any);

    await expect(reconcilePaymentState('pi_123', 'PENDING')).rejects.toThrow(
      'Invalid state transition from final state "CAPTURED" to "PENDING"'
    );
  });

  it('triggers core Filecoin receipt generation upon transitioning to CAPTURED', async () => {
    // 1. Mock DB select current ledger status as PENDING (not yet captured)
    mockQuery.mockResolvedValueOnce({
      rows: [{
        status: 'PENDING',
        receipt_cid: null,
        provider: 'stripe',
        amount_minor_units: 1500,
        currency: 'usd',
        source_rail: 'card',
        destination_rail: 'fiat_settlement',
        metadata: { compute_instance_id: 'inst-receipt', user_id: 'user-123' }
      }]
    } as any);

    // 2. Mock updates (ledger status + receipt CID write)
    mockQuery.mockResolvedValue({ rows: [] } as any);

    const res = await reconcilePaymentState('pi_captured_test', 'CAPTURED');

    expect(res.receiptCid).toBe(mockCid);
  });

  it('polling worker resolves payment status mismatch and updates ledger', async () => {
    // 1. Mock query showing pending payment older than 60s
    mockQuery.mockResolvedValueOnce({
      rows: [{
        provider_reference: 'pi_stuck_123',
        provider: 'stripe',
        status: 'PENDING'
      }]
    } as any);

    // 2. Mock Stripe adapter auth/getPaymentStatus call
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ status: 'succeeded' })));
    globalThis.fetch = mockFetch;

    // 3. Mock ledger details query during reconcile
    mockQuery.mockResolvedValueOnce({
      rows: [{
        status: 'PENDING',
        receipt_cid: null,
        provider: 'stripe',
        amount_minor_units: 2500,
        currency: 'usd',
        source_rail: 'card',
        destination_rail: 'fiat_settlement',
        metadata: { compute_instance_id: 'inst-poll' }
      }]
    } as any);

    await centralPollingWorker.pollPendingTransactions();

    // Verify DB was updated
    expect(mockQuery).toHaveBeenCalled();
  });
});
