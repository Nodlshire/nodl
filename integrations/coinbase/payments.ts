import { PspAdapter, NotConfiguredError } from '../payments/core';
import { UniversalPaymentObject } from '../payments/upo';

/**
 * Coinbase Commerce / CDP Payments Adapter.
 * API Model: POST /checkouts, GET /checkouts/{id}.
 */
export class CoinbaseAdapter implements PspAdapter {
  private get cdpApiKey(): string {
    const key = process.env.COINBASE_CDP_API_KEY;
    if (!key) {
      throw new NotConfiguredError('coinbase');
    }
    return key;
  }

  // TODO: Implement actual HTTP client request mapping to Coinbase CDP / Commerce API
  private async request<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
    this.cdpApiKey;

    console.log(`[coinbase] TODO: Execute real Coinbase HTTP request | ${method} ${path}`, body);
    throw new Error('Not implemented');
  }

  async createPayment(upo: UniversalPaymentObject): Promise<{ providerPaymentId: string }> {
    this.cdpApiKey;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_COINBASE === 'true') {
      return { providerPaymentId: `cb_chkt_${upo.payment_id}` };
    }

    // TODO: POST /checkouts
    return this.request<{ id: string }>('POST', '/checkouts', {
      name: `Compute Instance payment ${upo.metadata.compute_instance_id}`,
      pricing_type: 'fixed_price',
      local_price: {
        amount: (upo.amount_minor_units / 100).toFixed(2),
        currency: upo.currency,
      },
      metadata: {
        upo_payment_id: upo.payment_id,
        compute_instance_id: upo.metadata.compute_instance_id,
      },
    }).then(res => ({ providerPaymentId: res.id }));
  }

  async capturePayment(providerPaymentId: string): Promise<void> {
    this.cdpApiKey;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_COINBASE === 'true') {
      return;
    }

    // Coinbase Commerce payments are push-based and captured on-chain automatically.
    // No-op for capturePayment, status changes are processed via webhook or polling.
    console.log(`[coinbase] capturePayment is a no-op for push-based flows: ${providerPaymentId}`);
  }

  async cancelPayment(providerPaymentId: string): Promise<void> {
    this.cdpApiKey;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_COINBASE === 'true') {
      return;
    }

    // TODO: POST /checkouts/{id}/deactivate or mark expired
    await this.request<void>('POST', `/checkouts/${providerPaymentId}/deactivate`);
  }

  async refundPayment(providerPaymentId: string, amountMinorUnits?: number): Promise<void> {
    this.cdpApiKey;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_COINBASE === 'true') {
      return;
    }

    // TODO: Execute crypto refund transfer via CDP Transfer API
    console.log(`[coinbase] Execute crypto refund for checkouts ${providerPaymentId} | amount = ${amountMinorUnits}`);
    throw new Error('CDP Transfer API refund not implemented');
  }

  async getPaymentStatus(providerPaymentId: string): Promise<'PENDING' | 'PROCESSING' | 'CAPTURED' | 'REFUNDED' | 'FAILED'> {
    this.cdpApiKey;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_COINBASE === 'true') {
      return 'CAPTURED';
    }

    // TODO: GET /checkouts/{id} or get charges / transactions related to checkout
    const res = await this.request<{ status: string }>('GET', `/checkouts/${providerPaymentId}`);
    return this.mapStatus(res.status);
  }

  private mapStatus(status: string): 'PENDING' | 'PROCESSING' | 'CAPTURED' | 'REFUNDED' | 'FAILED' {
    switch (status.toLowerCase()) {
      case 'new':
      case 'pending':
        return 'PENDING';
      case 'completed':
      case 'resolved':
      case 'success':
        return 'CAPTURED';
      case 'refunded':
        return 'REFUNDED';
      case 'expired':
      case 'failed':
        return 'FAILED';
      default:
        return 'FAILED';
    }
  }
}
