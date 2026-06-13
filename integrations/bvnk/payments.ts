import { PspAdapter, NotConfiguredError } from '../payments/core';
import { UniversalPaymentObject } from '../payments/upo';

/**
 * BVNK Payments / Payouts Adapter.
 * API Model: POST /platform/v1/customers, POST /payment/v2/payouts, GET /ledger/v1/transactions.
 * Auth: Hawk Signature HMAC.
 */
export class BvnkAdapter implements PspAdapter {
  private get hawkCredentials(): { id: string; key: string } {
    const id = process.env.BVNK_HAWK_ID;
    const key = process.env.BVNK_HAWK_KEY;
    if (!id || !key) {
      throw new NotConfiguredError('bvnk');
    }
    return { id, key };
  }

  // TODO: Implement actual Hawk-HMAC authenticated request builder to BVNK
  private async request<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
    this.hawkCredentials;

    console.log(`[bvnk] TODO: Execute real Hawk-signed request | ${method} ${path}`, body);
    throw new Error('Not implemented');
  }

  async createPayment(upo: UniversalPaymentObject): Promise<{ providerPaymentId: string }> {
    this.hawkCredentials;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_BVNK === 'true') {
      return { providerPaymentId: `bvnk_tx_${upo.payment_id}` };
    }

    // TODO: POST /payment/v2/payouts or transaction invoice
    return this.request<{ uuid: string }>('POST', '/payment/v2/payouts', {
      amount: upo.amount_minor_units / 100,
      currency: upo.currency,
      reference: upo.payment_id,
      merchantId: upo.merchant_account_id,
    }).then(res => ({ providerPaymentId: res.uuid }));
  }

  async capturePayment(providerPaymentId: string): Promise<void> {
    this.hawkCredentials;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_BVNK === 'true') {
      return;
    }

    // Virtual accounts / payouts are automatically processed.
    console.log(`[bvnk] capturePayment is no-op for payouts: ${providerPaymentId}`);
  }

  async cancelPayment(providerPaymentId: string): Promise<void> {
    this.hawkCredentials;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_BVNK === 'true') {
      return;
    }

    // TODO: Cancel pending transaction if possible
    console.log(`[bvnk] Cancel transaction: ${providerPaymentId}`);
  }

  async refundPayment(providerPaymentId: string, amountMinorUnits?: number): Promise<void> {
    this.hawkCredentials;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_BVNK === 'true') {
      return;
    }

    // TODO: POST /payment/v2/payouts (inverse payout as refund)
    console.log(`[bvnk] Refund BVNK payout ${providerPaymentId} | amount = ${amountMinorUnits}`);
  }

  async getPaymentStatus(providerPaymentId: string): Promise<'PENDING' | 'PROCESSING' | 'CAPTURED' | 'REFUNDED' | 'FAILED'> {
    this.hawkCredentials;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_BVNK === 'true') {
      return 'CAPTURED';
    }

    // TODO: GET /ledger/v1/transactions/{id}
    const res = await this.request<{ status: string }>('GET', `/ledger/v1/transactions/${providerPaymentId}`);
    return this.mapStatus(res.status);
  }

  private mapStatus(status: string): 'PENDING' | 'PROCESSING' | 'CAPTURED' | 'REFUNDED' | 'FAILED' {
    switch (status.toUpperCase()) {
      case 'PENDING':
      case 'SUBMITTED':
        return 'PENDING';
      case 'PROCESSING':
        return 'PROCESSING';
      case 'SUCCESS':
      case 'COMPLETED':
        return 'CAPTURED';
      case 'REFUNDED':
        return 'REFUNDED';
      case 'FAILED':
      case 'REJECTED':
        return 'FAILED';
      default:
        return 'FAILED';
    }
  }
}
