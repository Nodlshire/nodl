import { checkStatus } from './stripe/activation_status';
import { createPaymentIntent, refundPayment, verifyWebhookSignature } from './stripe/activation_sdk';

async function run() {
  console.log("--- STRIPE TEST ---");
  const status = await checkStatus();
  console.log("Status Check:", status ? "PASS" : "FAIL");
  
  try {
     await createPaymentIntent(1000, 'usd');
  } catch(e: any) {
     console.log("Create Payment Intent:", e.message.includes('API Key') || e.type === 'StripeAuthenticationError' ? "PASS (Auth rejected properly)" : "FAIL");
  }
  
  try {
     await refundPayment('pi_test');
  } catch(e: any) {
     console.log("Refund Payment:", e.message.includes('API Key') || e.type === 'StripeAuthenticationError' ? "PASS (Auth rejected properly)" : "FAIL");
  }
  
  try {
     verifyWebhookSignature('{}', 'sig', 'secret');
  } catch(e: any) {
     console.log("Verify Webhook:", e.message.includes('No signatures found') ? "PASS" : "FAIL");
  }
}
run();
