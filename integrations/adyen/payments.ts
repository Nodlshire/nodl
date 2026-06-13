import { PspAdapter, NotConfiguredError } from '../payments/core';
import { UniversalPaymentObject } from '../payments/upo';

/**
 * Adyen Checkout API Payments Adapter.
 * API Model: POST /payments, POST /payments/{id}/captures, POST /payments/{id}/refunds, POST /payments/{id}/cancels.
 */
export class AdyenAdapter implements PspAdapter {
  private get apiKey(): string {
    const key = process.env.ADYEN_API_KEY;
    if (!key) {
      throw new NotConfiguredError('adyen');
    }
    return key;
  }

  // TODO: Implement actual HTTP client request mapping to Adyen Checkout API
  private async request<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
    this.apiKey;

    console.log(`[adyen] TODO: Execute real Adyen HTTP request | ${method} ${path}`, body);
    throw new Error('Not implemented');
  }

  async createPayment(upo: UniversalPaymentObject): Promise<{ providerPaymentId: string }> {
    this.apiKey;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_ADYEN === 'true') {
      return { providerPaymentId: `adyen_pay_${upo.payment_id}` };
    }

    // TODO: POST /payments
    return this.request<{ pspReference: string }>('POST', '/payments', {
      amount: {
        value: upo.amount_minor_units,
        currency: upo.currency,
      },
      reference: upo.payment_id,
      merchantAccount: upo.merchant_account_id,
    }).then(res => ({ providerPaymentId: res.pspReference }));
  }

  async capturePayment(providerPaymentId: string): Promise<void> {
    this.apiKey;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_ADYEN === 'true') {
      return;
    }

    // TODO: POST /payments/{id}/captures
    await this.request<void>('POST', `/payments/${providerPaymentId}/captures`);
  }

  async cancelPayment(providerPaymentId: string): Promise<void> {
    this.apiKey;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_ADYEN === 'true') {
      return;
    }

    // TODO: POST /payments/{id}/cancels
    await this.request<void>('POST', `/payments/${providerPaymentId}/cancels`);
  }

  async refundPayment(providerPaymentId: string, amountMinorUnits?: number): Promise<void> {
    this.apiKey;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_ADYEN === 'true') {
      return;
    }

    // TODO: POST /payments/{id}/refunds
    await this.request<void>('POST', `/payments/${providerPaymentId}/refunds`, {
      ...(amountMinorUnits !== undefined && { amount: { value: amountMinorUnits } }),
    });
  }

  async getPaymentStatus(providerPaymentId: string): Promise<'PENDING' | 'PROCESSING' | 'CAPTURED' | 'REFUNDED' | 'FAILED'> {
    this.apiKey;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_ADYEN === 'true') {
      return 'CAPTURED';
    }

    // TODO: GET /payments/{id} or check payment actions/modifications
    const res = await this.request<{ status: string }>('GET', `/payments/${providerPaymentId}`);
    return this.mapStatus(res.status);
  }

  private mapStatus(status: string): 'PENDING' | 'PROCESSING' | 'CAPTURED' | 'REFUNDED' | 'FAILED' {
    switch (status.toLowerCase()) {
      case 'received':
      case 'authorised':
        return 'PENDING';
      case 'captured':
        return 'CAPTURED';
      case 'refunded':
        return 'REFUNDED';
      case 'cancelled':
      case 'refused':
        return 'FAILED';
      default:
        return 'FAILED';
    }
  }
}
