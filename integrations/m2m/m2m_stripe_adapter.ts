import { createPaymentIntent, capturePayment, refundPayment, getPaymentIntent } from '../stripe/activation_sdk';

export interface UniversalPaymentObject {
  amount_minor_units: number;
  currency: string;
  idempotency_key: string;
  metadata?: {
    compute_instance_id?: string;
    agent_urn?: string;
    user_id?: string;
    [key: string]: any;
  };
}

export class M2MStripeAdapter {
  private idempotencyStore = new Set<string>();

  async processPayment(job: UniversalPaymentObject) {
    if (this.idempotencyStore.has(job.idempotency_key)) {
      throw new Error("Idempotency key already processed locally");
    }
    this.idempotencyStore.add(job.idempotency_key);

    const supportedCurrencies = ['usd', 'usdc', 'usdt', 'eur'];
    if (!supportedCurrencies.includes(job.currency.toLowerCase())) {
        throw new Error("Currency not supported by AP4M / M2M Standard");
    }

    try {
      const metadataMap: Record<string, string> = {};
      if (job.metadata) {
        if (job.metadata.compute_instance_id) metadataMap['compute_instance_id'] = job.metadata.compute_instance_id;
        if (job.metadata.agent_urn) metadataMap['agent_urn'] = job.metadata.agent_urn;
        if (job.metadata.user_id) metadataMap['user_id'] = job.metadata.user_id;
      }

      const intent = await createPaymentIntent(job.amount_minor_units, job.currency, job.idempotency_key, metadataMap);
      
      return { status: 'PROCESSING', intentId: intent.id };
    } catch (e) {
      this.idempotencyStore.delete(job.idempotency_key);
      throw e;
    }
  }

  async finalizePayment(intentId: string, success: boolean, idempotencyKey?: string) {
    if (success) {
      const res = await capturePayment(intentId, idempotencyKey);
      return { status: 'CAPTURED', data: res };
    } else {
      const res = await refundPayment(intentId, idempotencyKey);
      return { status: 'REFUNDED', data: res };
    }
  }

  async reconcileState(intentId: string) {
    const intent = await getPaymentIntent(intentId);
    if (intent.status === 'succeeded') return 'CAPTURED';
    if (intent.status === 'requires_capture') return 'PROCESSING';
    if (intent.status === 'canceled') return 'REFUNDED';
    return 'PENDING';
  }
}
