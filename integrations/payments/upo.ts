/**
 * Wnode — Universal Payment Object (UPO)
 *
 * Defines the canonical representation of a payment across Wnode's multi-PSP framework.
 */

import { randomUUID } from 'crypto';

// ─── UPO Types ────────────────────────────────────────────────────────────────

export type SourceRail =
  | 'card'
  | 'sepa'
  | 'onchain_solana'
  | 'onchain_base'
  | 'onchain_ethereum';

export type DestinationRail =
  | 'fiat_settlement'
  | 'usdc_settlement'
  | 'usdt_settlement';

export type UPOStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'CAPTURED'
  | 'REFUNDED'
  | 'FAILED';

export interface UPOMetadata {
  compute_instance_id: string; // REQUIRED
  agent_urn?:          string; // optional
  user_id?:            string; // optional
  [key: string]:       unknown;
}

export interface UniversalPaymentObject {
  payment_id:          string;          // UUID v4
  idempotency_key:     string;          // UUID v4
  amount_minor_units:  number;          // integer
  currency:            string;          // 3-letter ISO (e.g. "USD", "EUR")
  source_rail:         SourceRail;
  destination_rail:    DestinationRail;
  merchant_account_id: string;
  metadata:            UPOMetadata;
  status:              UPOStatus;
  provider_reference?: string;          // PSP-specific reference (e.g., Stripe pi_*)
}

// ─── JSON Schema ──────────────────────────────────────────────────────────────

export const UPOSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'UniversalPaymentObject',
  type: 'object',
  required: [
    'payment_id',
    'idempotency_key',
    'amount_minor_units',
    'currency',
    'source_rail',
    'destination_rail',
    'merchant_account_id',
    'metadata',
    'status'
  ],
  properties: {
    payment_id: { type: 'string', format: 'uuid' },
    idempotency_key: { type: 'string' },
    amount_minor_units: { type: 'integer', minimum: 1 },
    currency: { type: 'string', minLength: 3, maxLength: 3 },
    source_rail: {
      type: 'string',
      enum: ['card', 'sepa', 'onchain_solana', 'onchain_base', 'onchain_ethereum']
    },
    destination_rail: {
      type: 'string',
      enum: ['fiat_settlement', 'usdc_settlement', 'usdt_settlement']
    },
    merchant_account_id: { type: 'string' },
    status: {
      type: 'string',
      enum: ['PENDING', 'PROCESSING', 'CAPTURED', 'REFUNDED', 'FAILED']
    },
    provider_reference: { type: 'string' },
    metadata: {
      type: 'object',
      required: ['compute_instance_id'],
      properties: {
        compute_instance_id: { type: 'string' },
        agent_urn: { type: 'string' },
        user_id: { type: 'string' }
      },
      additionalProperties: true
    }
  }
};

// ─── Validation Helper ────────────────────────────────────────────────────────

export interface ValidationResult {
  valid:  boolean;
  errors: string[];
}

/**
 * Validates a UPO against constraints without external dependency overhead.
 */
export function validateUPO(upo: Partial<UniversalPaymentObject>): ValidationResult {
  const errors: string[] = [];

  if (!upo.payment_id || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(upo.payment_id)) {
    errors.push('payment_id must be a valid UUID v4');
  }
  if (!upo.idempotency_key) {
    errors.push('idempotency_key is required');
  }
  if (upo.amount_minor_units === undefined || !Number.isInteger(upo.amount_minor_units) || upo.amount_minor_units <= 0) {
    errors.push('amount_minor_units must be a positive integer');
  }
  if (!upo.currency || upo.currency.length !== 3) {
    errors.push('currency must be a 3-letter ISO code');
  }
  
  const validSources: SourceRail[] = ['card', 'sepa', 'onchain_solana', 'onchain_base', 'onchain_ethereum'];
  if (!upo.source_rail || !validSources.includes(upo.source_rail)) {
    errors.push(`source_rail must be one of: ${validSources.join(', ')}`);
  }

  const validDests: DestinationRail[] = ['fiat_settlement', 'usdc_settlement', 'usdt_settlement'];
  if (!upo.destination_rail || !validDests.includes(upo.destination_rail)) {
    errors.push(`destination_rail must be one of: ${validDests.join(', ')}`);
  }

  if (!upo.merchant_account_id) {
    errors.push('merchant_account_id is required');
  }

  const validStatuses: UPOStatus[] = ['PENDING', 'PROCESSING', 'CAPTURED', 'REFUNDED', 'FAILED'];
  if (!upo.status || !validStatuses.includes(upo.status)) {
    errors.push(`status must be one of: ${validStatuses.join(', ')}`);
  }

  if (!upo.metadata || typeof upo.metadata !== 'object') {
    errors.push('metadata must be an object');
  } else if (!upo.metadata.compute_instance_id) {
    errors.push('metadata.compute_instance_id is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// ─── Factory ─────────────────────────────────────────────────────────────────

export function buildUPO(params: Omit<UniversalPaymentObject, 'payment_id' | 'status'>): UniversalPaymentObject {
  const upo: UniversalPaymentObject = {
    payment_id: randomUUID(),
    status:     'PENDING',
    ...params
  };

  const validation = validateUPO(upo);
  if (!validation.valid) {
    throw new Error(`Invalid UPO: ${validation.errors.join('; ')}`);
  }

  return upo;
}
