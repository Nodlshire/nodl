export type SourceRail = 'card' | 'sepa' | 'onchain_solana' | 'onchain_base' | 'onchain_ethereum';
export type DestinationRail = 'fiat_settlement' | 'usdc_settlement' | 'usdt_settlement';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'CAPTURED' | 'REFUNDED' | 'FAILED';
export type Region = 'EU' | 'US' | 'APAC' | 'UK' | 'GLOBAL';

export interface UniversalPaymentObject {
  payment_id: string; // uuid
  idempotency_key: string;
  amount_minor_units: number;
  currency: string; // ISO 4217
  source_rail: SourceRail;
  destination_rail: DestinationRail;
  merchant_account_id: string;
  region?: Region;
  metadata?: {
    compute_instance_id?: string;
    agent_urn?: string;
    user_id?: string;
    [key: string]: any;
  };
  status: PaymentStatus;
}
