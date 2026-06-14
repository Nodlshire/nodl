import { dispatchPayment } from './psp_dispatcher';
import { UniversalPaymentObject } from './universal_payment_object';
import * as fs from 'fs';

const OUT_FILE = '/home/obregan/Documents/nodl/integrations/m2m/routing_test_results.txt';

async function runTests() {
  let output = "--- ROUTING TEST RESULTS ---\n\n";

  const buildUPO = (overrides: Partial<UniversalPaymentObject>): UniversalPaymentObject => ({
    payment_id: 'test-' + Date.now() + Math.random(),
    idempotency_key: 'ik-' + Date.now(),
    amount_minor_units: 1000,
    currency: 'usd',
    source_rail: 'card',
    destination_rail: 'fiat_settlement',
    merchant_account_id: 'ma_123',
    status: 'PENDING',
    ...overrides
  });

  const cases = [
    { name: 'EU card -> Stripe', upo: buildUPO({ region: 'EU', source_rail: 'card', currency: 'eur' }), expectedPsp: 'stripe' },
    { name: 'US card -> Stripe', upo: buildUPO({ region: 'US', source_rail: 'card', currency: 'usd' }), expectedPsp: 'stripe' },
    { name: 'Onchain USDC -> Coinbase', upo: buildUPO({ source_rail: 'onchain_ethereum', destination_rail: 'usdc_settlement' }), expectedPsp: 'coinbase_business' },
    { name: 'High-volume payout -> BVNK', upo: buildUPO({ amount_minor_units: 2000000, destination_rail: 'usdc_settlement' }), expectedPsp: 'bvnk' },
    { name: 'APAC crypto -> OKX', upo: buildUPO({ region: 'APAC', source_rail: 'onchain_solana' }), expectedPsp: 'okx' },
    { name: 'Multi-chain agent -> Eco', upo: buildUPO({ metadata: { agent_urn: 'urn:agent:multi-chain' } }), expectedPsp: 'eco' },
    { name: 'Cross-border stablecoin -> Bridge', upo: buildUPO({ currency: 'usd', destination_rail: 'usdc_settlement' }), expectedPsp: 'bridge' },
  ];

  for (const c of cases) {
    const res = await dispatchPayment(c.upo);
    const passed = res.psp === c.expectedPsp;
    output += `Test: ${c.name}\nExpected: ${c.expectedPsp} | Got: ${res.psp}\nResult: ${passed ? 'PASS' : 'FAIL'} (${res.reason})\n\n`;
  }

  // Test Stripe Failure -> Checkout fallback
  const fallbackUpo = buildUPO({ region: 'US', source_rail: 'card', currency: 'usd' });
  const resFailover = await dispatchPayment(fallbackUpo, 'stripe');
  const fallbackPassed = resFailover.psp === 'checkout';
  output += `Test: Stripe failure -> Checkout fallback\nExpected: checkout | Got: ${resFailover.psp}\nResult: ${fallbackPassed ? 'PASS' : 'FAIL'} (${resFailover.reason})\n\n`;

  fs.writeFileSync(OUT_FILE, output);
  console.log("Tests Complete. Wrote results to " + OUT_FILE);
}

runTests();
