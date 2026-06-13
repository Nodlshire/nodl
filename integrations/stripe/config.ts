/**
 * Wnode × Stripe — Configuration Loader
 *
 * Ground Truth Facts (Corporate Business Account):
 *  - Crypto and Stablecoins sub-profile approved.
 *  - Secret keys via standard Bearer Auth.
 *  - Webhook verification via Stripe-Signature header (HMAC-SHA256).
 */

export interface StripeConfig {
  secretKey:       string;
  webhookSecret:   string;
  accountRegion:   string;  // e.g. "US", "EU"
}

export function loadStripeConfig(): StripeConfig {
  return {
    secretKey:     process.env.STRIPE_SECRET_KEY      ?? 'sk_test_mock',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET  ?? 'whsec_mock',
    accountRegion: process.env.STRIPE_ACCOUNT_REGION  ?? 'US',
  };
}
