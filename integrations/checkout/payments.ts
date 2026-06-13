import { PspAdapter, NotConfiguredError } from '../payments/core';
import { UniversalPaymentObject } from '../payments/upo';

/**
 * Checkout.com Payments Adapter (Unified Payments API).
 * API Model: POST /payments, POST /payments/{id}/captures, POST /payments/{id}/refunds, POST /payments/{id}/voids.
 */
export class CheckoutAdapter implements PspAdapter {
  private get apiKey(): string {
    const key = process.env.CHECKOUT_SECRET_KEY;
    if (!key) {
      throw new NotConfiguredError('checkout');
    }
    return key;
  }

  // TODO: Implement actual HTTP client request mapping to https://api.checkout.com
  private async request<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
    // Validate config presence
    this.apiKey;

    console.log(`[checkout] TODO: Execute real HTTP request | ${method} ${path}`, body);
    throw new Error('Not implemented');
  }

  async createPayment(upo: UniversalPaymentObject): Promise<{ providerPaymentId: string }> {
    this.apiKey; // enforce config check

    // Mock response for tests if enabled
    if (process.env.NODE_ENV === 'test' || process.env.MOCK_CHECKOUT === 'true') {
      return { providerPaymentId: `cko_pay_${upo.payment_id}` };
    }

    // TODO: POST /payments
    // Body maps UPO: { amount: upo.amount_minor_units, currency: upo.currency, reference: upo.payment_id ... }
    return this.request<{ id: string }>('POST', '/payments', {
      amount: upo.amount_minor_units,
      currency: upo.currency,
      reference: upo.payment_id,
      capture: false, // manual capture required
    }).then(res => ({ providerPaymentId: res.id }));
  }

  async capturePayment(providerPaymentId: string): Promise<void> {
    this.apiKey;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_CHECKOUT === 'true') {
      return;
    }

    // TODO: POST /payments/{id}/captures
    await this.request<void>('POST', `/payments/${providerPaymentId}/captures`);
  }

  async cancelPayment(providerPaymentId: string): Promise<void> {
    this.apiKey;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_CHECKOUT === 'true') {
      return;
    }

    // TODO: POST /payments/{id}/voids
    await this.request<void>('POST', `/payments/${providerPaymentId}/voids`);
  }

  async refundPayment(providerPaymentId: string, amountMinorUnits?: number): Promise<void> {
    this.apiKey;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_CHECKOUT === 'true') {
      return;
    }

    // TODO: POST /payments/{id}/refunds
    await this.request<void>('POST', `/payments/${providerPaymentId}/refunds`, {
      ...(amountMinorUnits !== undefined && { amount: amountMinorUnits }),
    });
  }

  async getPaymentStatus(providerPaymentId: string): Promise<'PENDING' | 'PROCESSING' | 'CAPTURED' | 'REFUNDED' | 'FAILED'> {
    this.apiKey;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_CHECKOUT === 'true') {
      return 'CAPTURED';
    }

    // TODO: GET /payments/{id}/actions or GET /payments/{id}
    const res = await this.request<{ status: string }>('GET', `/payments/${providerPaymentId}`);
    return this.mapStatus(res.status);
  }

  private mapStatus(status: string): 'PENDING' | 'PROCESSING' | 'CAPTURED' | 'REFUNDED' | 'FAILED' {
    switch (status.toLowerCase()) {
      case 'authorized':
      case 'pending':
        return 'PENDING';
      case 'captured':
        return 'CAPTURED';
      case 'refunded':
        return 'REFUNDED';
      case 'voided':
      case 'declined':
        return 'FAILED';
      default:
        return 'FAILED';
    }
  }
}
