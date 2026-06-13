import { PspAdapter } from './core';
import { UniversalPaymentObject } from './upo';
import { StripeAdapter } from '../stripe/payments';
import { CheckoutAdapter } from '../checkout/payments';
import { AdyenAdapter } from '../adyen/payments';
import { CoinbaseAdapter } from '../coinbase/payments';
import { BvnkAdapter } from '../bvnk/payments';
import { OkxAdapter } from '../okx/payments';

export type ProviderName = 'stripe' | 'checkout' | 'adyen' | 'coinbase' | 'bvnk' | 'okx';

const registry = new Map<ProviderName, PspAdapter>();

// Register all adapters
registry.set('stripe', new StripeAdapter());
registry.set('checkout', new CheckoutAdapter());
registry.set('adyen', new AdyenAdapter());
registry.set('coinbase', new CoinbaseAdapter());
registry.set('bvnk', new BvnkAdapter());
registry.set('okx', new OkxAdapter());

/**
 * Retrieve a specific PSP adapter by name.
 */
export function getProvider(name: ProviderName): PspAdapter {
  const adapter = registry.get(name);
  if (!adapter) {
    throw new Error(`Provider "${name}" not registered.`);
  }
  return adapter;
}

/**
 * Route a payment to the appropriate PSP adapter based on UPO source/destination rails.
 */
export function routePayment(upo: UniversalPaymentObject): PspAdapter {
  // 1. BVNK handles payouts/treasury settlement destination rails
  if (upo.destination_rail === 'usdc_settlement' || upo.destination_rail === 'usdt_settlement') {
    if (upo.metadata.payment_type === 'payout') {
      return getProvider('bvnk');
    }
  }

  // 2. Stripe is the active default card/sepa processor
  if (upo.source_rail === 'card' || upo.source_rail === 'sepa') {
    return getProvider('stripe');
  }

  // 3. Route onchain crypto/stablecoin rails to Coinbase Business or OKX
  if (upo.source_rail.startsWith('onchain_')) {
    // Default to coinbase; okx is used for specific low latency cases
    if (upo.metadata.preferred_provider === 'okx') {
      return getProvider('okx');
    }
    return getProvider('coinbase');
  }

  // Fallback default
  return getProvider('stripe');
}
