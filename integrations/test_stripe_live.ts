import { M2MStripeAdapter, UniversalPaymentObject } from './m2m/m2m_stripe_adapter';
import { verifyWebhookSignature } from './stripe/activation_sdk';

async function run() {
  console.log("--- STRIPE LIVE E2E TEST ---");
  const adapter = new M2MStripeAdapter();

  const job: UniversalPaymentObject = {
    amount_minor_units: 2000,
    currency: 'usd',
    idempotency_key: 'test_m2m_job_' + Date.now(),
    metadata: {
      compute_instance_id: 'i-0x1234',
      agent_urn: 'urn:wnode:agent:001',
      user_id: 'usr_test123'
    }
  };

  try {
    console.log("1. Creating PaymentIntent...");
    const result = await adapter.processPayment(job);
    console.log("   Result:", result);
    
    let state = await adapter.reconcileState(result.intentId);
    console.log("   State:", state);

    console.log("2. Capturing PaymentIntent...");
    try {
        const captureRes = await adapter.finalizePayment(result.intentId, true, 'cap_' + job.idempotency_key);
        console.log("   Capture Result:", captureRes);
    } catch(e: any) {
        console.log("   Capture Failed (Expected without payment method attached):", e.message);
    }
    
    state = await adapter.reconcileState(result.intentId);
    console.log("   State after Capture attempt:", state);

    console.log("3. Refunding PaymentIntent...");
    try {
        const refundRes = await adapter.finalizePayment(result.intentId, false, 'ref_' + job.idempotency_key);
        console.log("   Refund Result:", refundRes);
    } catch(e: any) {
        console.log("   Refund Failed (Expected without successful capture):", e.message);
    }

    console.log("4. Simulating Webhook signature verification...");
    const payload = '{"id": "evt_test", "type": "payment_intent.succeeded"}';
    const fakeSecret = 'whsec_test_secret';
    const timestamp = Math.floor(Date.now() / 1000);
    const signedPayload = `${timestamp}.${payload}`;
    const hash = require('crypto').createHmac('sha256', fakeSecret).update(signedPayload).digest('hex');
    const signatureHeader = `t=${timestamp},v1=${hash}`;
    
    const isValid = verifyWebhookSignature(payload, signatureHeader, fakeSecret);
    console.log("   Webhook Valid:", isValid);

  } catch (err: any) {
    console.error("Test failed globally:", err.message);
  }
}
run();
