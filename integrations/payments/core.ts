import { UniversalPaymentObject } from './upo';

/**
 * Generic PSP Adapter interface that all payment service providers (Stripe, Checkout,
 * Adyen, Coinbase, BVNK, OKX) must implement.
 */
export interface PspAdapter {
  createPayment(upo: UniversalPaymentObject): Promise<{ providerPaymentId: string }>;
  capturePayment(providerPaymentId: string): Promise<void>;
  cancelPayment(providerPaymentId: string): Promise<void>;
  refundPayment(providerPaymentId: string, amountMinorUnits?: number): Promise<void>;
  getPaymentStatus(providerPaymentId: string): Promise<'PENDING' | 'PROCESSING' | 'CAPTURED' | 'REFUNDED' | 'FAILED'>;
}

/**
 * Thrown when an adapter is called but has not been configured (e.g. credentials missing).
 */
export class NotConfiguredError extends Error {
  constructor(provider: string) {
    super(`PSP Provider "${provider}" is not configured or active.`);
    this.name = 'NotConfiguredError';
  }
}

/**
 * Standard PSP Execution Error wrapper.
 */
export class PspError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'PspError';
  }
}
