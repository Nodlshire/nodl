import { UniversalPaymentObject } from './universal_payment_object';

export interface RoutingDecision {
  psp: string;
  reason: string;
  fallbackCandidates: string[];
}

export function routePayment(upo: UniversalPaymentObject): RoutingDecision {
  const { source_rail, destination_rail, currency, region, amount_minor_units, metadata } = upo;
  
  const isCard = source_rail === 'card';
  const isOnchain = source_rail.startsWith('onchain_');
  const isStablecoinDest = destination_rail === 'usdc_settlement' || destination_rail === 'usdt_settlement';
  const isFiatDest = destination_rail === 'fiat_settlement';
  
  if (metadata?.agent_urn && metadata.agent_urn.includes('multi-chain')) {
    return {
      psp: 'eco',
      reason: 'Multi-chain agent intent routing indicated by agent_urn',
      fallbackCandidates: ['coinbase_business', 'okx']
    };
  }

  if (region === 'APAC' && isOnchain) {
    return {
      psp: 'okx',
      reason: 'APAC region with onchain source rail',
      fallbackCandidates: ['coinbase_business', 'bvnk']
    };
  }

  if (currency === 'usd' && isStablecoinDest) {
    return {
      psp: 'bridge',
      reason: 'USD to USDC onramp / cross-border stablecoin routing',
      fallbackCandidates: ['coinbase_business']
    };
  }

  const highVolumeThreshold = 1000000;
  if (isStablecoinDest && amount_minor_units > highVolumeThreshold) {
    return {
      psp: 'bvnk',
      reason: 'High-volume stablecoin payout / treasury operation',
      fallbackCandidates: ['coinbase_business', 'stripe']
    };
  }

  if (isOnchain && isStablecoinDest) {
    return {
      psp: 'coinbase_business',
      reason: 'Default for onchain stablecoin (USDC/USDT/PYUSD) x402 payments',
      fallbackCandidates: ['bvnk', 'okx']
    };
  }

  if (region === 'EU' && source_rail === 'sepa') {
    return {
      psp: 'adyen',
      reason: 'Regulated EU flows / SEPA direct debit',
      fallbackCandidates: ['stripe', 'checkout']
    };
  }

  if (isCard || isFiatDest || ((region === 'EU' || region === 'US') && (currency === 'usd' || currency === 'eur'))) {
    return {
      psp: 'stripe',
      reason: 'Default for fiat settlement, cards, and AP4M micropayments',
      fallbackCandidates: ['checkout', 'adyen']
    };
  }

  return {
    psp: 'stripe',
    reason: 'Catch-all fallback',
    fallbackCandidates: ['checkout', 'adyen', 'coinbase_business', 'bvnk', 'okx']
  };
}
