/**
 * Wnode × Stripe — Payments Adapter Module
 *
 * Implements the PspAdapter interface, transforming the Universal Payment
 * Object (UPO) into Stripe API requests.
 */

import { loadStripeConfig } from './config';
import { UniversalPaymentObject, UPOStatus, SourceRail } from '../payments/upo';
import { PspAdapter, PspError } from '../payments/core';

// ─── Stripe Client Wrapper ────────────────────────────────────────────────────

/**
 * Direct HTTP client wrapper for Stripe API (avoids heavy npm SDK load time).
 * Follows PaymentIntents state machine:
 *   requires_payment_method → requires_action → requires_capture → succeeded.
 */
class StripeHttpClient {
  private readonly config = loadStripeConfig();

  private get headers(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.config.secretKey}`,
      'Content-Type':  'application/x-www-form-urlencoded',
    };
  }

  async request<T>(
    method: 'GET' | 'POST',
    path: string,
    body?: Record<string, string | number | boolean | Record<string, string>>,
    idempotencyKey?: string
  ): Promise<T> {
    const url = `https://api.stripe.com/v1${path}`;
    const headers = { ...this.headers };
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    let bodyString = '';
    if (body) {
      bodyString = this.encodeBody(body);
    }

    try {
      const res = await fetch(url, {
        method,
        headers,
        ...(method === 'POST' && { body: bodyString }),
      });

      const json = await res.json() as Record<string, unknown>;

      if (!res.ok) {
        const errObj = (json.error as Record<string, unknown>) ?? {};
        throw new PspError(
          String(errObj.code ?? 'stripe_error'),
          String(errObj.message ?? 'Unknown Stripe error'),
          res.status
        );
      }

      return json as T;
    } catch (err) {
      if (err instanceof PspError) throw err;
      throw new PspError('network_error', String(err));
    }
  }

  private encodeBody(
    obj: Record<string, string | number | boolean | Record<string, string>>,
    prefix = ''
  ): string {
    const str: string[] = [];
    for (const p in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, p)) {
        const k = prefix ? `${prefix}[${p}]` : p;
        const v = obj[p];
        if (v !== null && typeof v === 'object') {
          str.push(this.encodeBody(v as Record<string, string>, k));
        } else {
          str.push(encodeURIComponent(k) + '=' + encodeURIComponent(String(v)));
        }
      }
    }
    return str.join('&');
  }
}

// ─── Stripe Adapter ──────────────────────────────────────────────────────────

export class StripeAdapter implements PspAdapter {
  private readonly client = new StripeHttpClient();

  // ── 1. Create Payment ──────────────────────────────────────────────────────

  async createPayment(upo: UniversalPaymentObject): Promise<{ providerPaymentId: string }> {
    const paymentMethodTypes = this.mapSourceRailToPaymentMethods(upo.source_rail);

    const body: Record<string, string | number | boolean | Record<string, string>> = {
      amount:         upo.amount_minor_units,
      currency:       upo.currency.toLowerCase(),
      capture_method: 'manual', // required for compute workload capture-after-verification
      metadata: {
        compute_instance_id: upo.metadata.compute_instance_id,
        ...(upo.metadata.agent_urn && { agent_urn: upo.metadata.agent_urn }),
        ...(upo.metadata.user_id   && { user_id: upo.metadata.user_id }),
        provider:            'stripe',
      },
    };

    // Append payment method types
    paymentMethodTypes.forEach((type, idx) => {
      body[`payment_method_types[${idx}]`] = type;
    });

    const res = await this.client.request<{ id: string }>(
      'POST',
      '/payment_intents',
      body,
      upo.idempotency_key
    );

    return { providerPaymentId: res.id };
  }

  // ── 2. Capture Payment ──────────────────────────────────────────────────────

  async capturePayment(paymentIntentId: string): Promise<void> {
    const intent = await this.client.request<Record<string, unknown>>(
      'POST',
      `/payment_intents/${paymentIntentId}/capture`
    );

    if (intent.status !== 'succeeded') {
      throw new PspError('capture_failed', `Stripe PaymentIntent status: ${intent.status}`);
    }
  }

  // ── 3. Cancel Payment ───────────────────────────────────────────────────────

  async cancelPayment(paymentIntentId: string): Promise<void> {
    await this.client.request<void>('POST', `/payment_intents/${paymentIntentId}/cancel`);
  }

  // ── 4. Refund Payment ───────────────────────────────────────────────────────

  async refundPayment(paymentIntentId: string, amountMinorUnits?: number): Promise<void> {
    const body: Record<string, string | number> = {
      payment_intent: paymentIntentId,
    };
    if (amountMinorUnits !== undefined) {
      body.amount = amountMinorUnits;
    }
    await this.client.request<void>('POST', '/refunds', body);
  }

  // ── 5. Get Payment Status ──────────────────────────────────────────────────

  async getPaymentStatus(paymentIntentId: string): Promise<'PENDING' | 'PROCESSING' | 'CAPTURED' | 'REFUNDED' | 'FAILED'> {
    const res = await this.client.request<{ status: string }>(
      'GET',
      `/payment_intents/${paymentIntentId}`
    );
    return this.mapStripeStatusToUPO(res.status);
  }

  // ── Private Mappers ────────────────────────────────────────────────────────

  private mapSourceRailToPaymentMethods(rail: SourceRail): string[] {
    switch (rail) {
      case 'card':
        return ['card'];
      case 'sepa':
        return ['sepa_debit'];
      case 'onchain_ethereum':
      case 'onchain_base':
      case 'onchain_solana':
        return ['crypto', 'card'];
      default:
        return ['card'];
    }
  }

  private mapStripeStatusToUPO(status: string): 'PENDING' | 'PROCESSING' | 'CAPTURED' | 'REFUNDED' | 'FAILED' {
    switch (status) {
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
        return 'PENDING';
      case 'processing':
        return 'PROCESSING';
      case 'requires_capture':
        return 'PENDING'; // Authorized but not yet captured
      case 'succeeded':
        return 'CAPTURED';
      case 'canceled':
        return 'FAILED';
      default:
        return 'FAILED';
    }
  }
}
