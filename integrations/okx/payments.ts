import { PspAdapter, NotConfiguredError } from '../payments/core';
import { UniversalPaymentObject } from '../payments/upo';

/**
 * OKX Pay / Transaction Adapter.
 * API Model: REST/WS, OK-ACCESS-KEY, OK-ACCESS-SIGN signatures.
 * Endpoints: Pay link / pay-in, POST /api/v5/asset/withdrawal (refund), GET /api/v5/account/bills.
 */
export class OkxAdapter implements PspAdapter {
  private get credentials(): { apiKey: string; secretKey: string; passphrase?: string } {
    const apiKey = process.env.OKX_API_KEY;
    const secretKey = process.env.OKX_SECRET_KEY;
    const passphrase = process.env.OKX_PASSPHRASE;
    if (!apiKey || !secretKey) {
      throw new NotConfiguredError('okx');
    }
    return { apiKey, secretKey, passphrase };
  }

  // TODO: Implement OKX-signed REST call generator
  private async request<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
    this.credentials;

    console.log(`[okx] TODO: Execute real OKX authenticated request | ${method} ${path}`, body);
    throw new Error('Not implemented');
  }

  async createPayment(upo: UniversalPaymentObject): Promise<{ providerPaymentId: string }> {
    this.credentials;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_OKX === 'true') {
      return { providerPaymentId: `okx_bill_${upo.payment_id}` };
    }

    // TODO: Create OKX Pay links / pay-in bills
    return this.request<{ billId: string }>('POST', '/api/v5/asset/pay-in', {
      amount: (upo.amount_minor_units / 100).toFixed(2),
      ccy: upo.currency,
      refId: upo.payment_id,
    }).then(res => ({ providerPaymentId: res.billId }));
  }

  async capturePayment(providerPaymentId: string): Promise<void> {
    this.credentials;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_OKX === 'true') {
      return;
    }

    // OKX pay-in assets are captured directly on-chain on arrival.
    console.log(`[okx] capturePayment is a no-op for on-chain pay-in: ${providerPaymentId}`);
  }

  async cancelPayment(providerPaymentId: string): Promise<void> {
    this.credentials;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_OKX === 'true') {
      return;
    }

    // TODO: Deactivate payment link / bill
    console.log(`[okx] Cancel OKX bill: ${providerPaymentId}`);
  }

  async refundPayment(providerPaymentId: string, amountMinorUnits?: number): Promise<void> {
    this.credentials;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_OKX === 'true') {
      return;
    }

    // TODO: POST /api/v5/asset/withdrawal for assets
    await this.request<void>('POST', '/api/v5/asset/withdrawal', {
      billId: providerPaymentId,
      ...(amountMinorUnits !== undefined && { amt: (amountMinorUnits / 100).toFixed(2) }),
    });
  }

  async getPaymentStatus(providerPaymentId: string): Promise<'PENDING' | 'PROCESSING' | 'CAPTURED' | 'REFUNDED' | 'FAILED'> {
    this.credentials;

    if (process.env.NODE_ENV === 'test' || process.env.MOCK_OKX === 'true') {
      return 'CAPTURED';
    }

    // TODO: GET /api/v5/account/bills
    const res = await this.request<{ data: Array<{ status: string }> }>('GET', `/api/v5/account/bills?billId=${providerPaymentId}`);
    const bill = res.data?.[0];
    if (!bill) return 'FAILED';
    return this.mapStatus(bill.status);
  }

  private mapStatus(status: string): 'PENDING' | 'PROCESSING' | 'CAPTURED' | 'REFUNDED' | 'FAILED' {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'PENDING';
      case 'processing':
        return 'PROCESSING';
      case 'success':
      case 'completed':
        return 'CAPTURED';
      case 'refunded':
        return 'REFUNDED';
      case 'failed':
      case 'expired':
        return 'FAILED';
      default:
        return 'FAILED';
    }
  }
}
