import * as crypto from 'crypto';

const getSecretKey = () => process.env.STRIPE_SECRET_KEY || '';

export async function createPaymentIntent(amount: number, currency: string, idempotencyKey: string, metadata: Record<string, string> = {}) {
  const params = new URLSearchParams();
  params.append('amount', amount.toString());
  params.append('currency', currency);
  params.append('capture_method', 'manual');
  
  for (const [key, value] of Object.entries(metadata)) {
    params.append(`metadata[${key}]`, value);
  }

  const res = await fetch('https://api.stripe.com/v1/payment_intents', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getSecretKey()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Idempotency-Key': idempotencyKey,
    },
    body: params.toString()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to create PaymentIntent');
  return data;
}

export async function capturePayment(intentId: string, idempotencyKey?: string) {
  const headers: any = {
    'Authorization': `Bearer ${getSecretKey()}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;

  const res = await fetch(`https://api.stripe.com/v1/payment_intents/${intentId}/capture`, {
    method: 'POST',
    headers,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to capture PaymentIntent');
  return data;
}

export async function refundPayment(intentId: string, idempotencyKey?: string) {
  const params = new URLSearchParams();
  params.append('payment_intent', intentId);

  const headers: any = {
    'Authorization': `Bearer ${getSecretKey()}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;

  const res = await fetch(`https://api.stripe.com/v1/refunds`, {
    method: 'POST',
    headers,
    body: params.toString()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to refund PaymentIntent');
  return data;
}

export async function getPaymentIntent(intentId: string) {
  const res = await fetch(`https://api.stripe.com/v1/payment_intents/${intentId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getSecretKey()}`,
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch PaymentIntent');
  return data;
}

export function verifyWebhookSignature(payload: string, signature: string, secret: string) {
  if (!signature || !secret) return false;
  
  // Stripe signatures format: t=timestamp,v1=hash
  const sigMap = signature.split(',').reduce((acc: any, part) => {
    const [k, v] = part.split('=');
    acc[k] = v;
    return acc;
  }, {});

  const signedPayload = `${sigMap.t}.${payload}`;
  const expectedSignature = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
  
  return expectedSignature === sigMap.v1;
}
