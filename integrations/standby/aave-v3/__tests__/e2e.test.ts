import { JsonRpcProvider } from 'ethers';
import { AAVE_CONFIG } from '../config';
import { HealthMonitor } from '../aave_automation/health_monitor';
import { PriceMonitor } from '../aave_automation/price_monitor';

// Skipped by default to prevent CI failures without active RPCs.
// Run manually via `npx jest .../e2e.test.ts`
describe.skip('Aave E2E Tests', () => {
  let provider: JsonRpcProvider;

  beforeAll(() => {
    // Uses local Anvil fork or public RPC URL if specified
    const rpcUrl = process.env.AAVE_MAINNET_RPC_URL || "http://127.0.0.1:8545";
    provider = new JsonRpcProvider(rpcUrl);
    
    AAVE_CONFIG.ENABLE_AAVE_HEALTH_MONITORING = true;
    AAVE_CONFIG.ENABLE_AAVE_PRICE_MONITORING = true;
  });

  afterAll(() => {
    AAVE_CONFIG.ENABLE_AAVE_HEALTH_MONITORING = false;
    AAVE_CONFIG.ENABLE_AAVE_PRICE_MONITORING = false;
  });

  it('computes real health factor from mainnet', async () => {
    const monitor = new HealthMonitor(provider);
    
    // Using a known burn/null address, which has no debt (HF should be Infinity)
    const knownAddress = "0x0000000000000000000000000000000000000000";
    
    const result = await monitor.checkHealthFactor(knownAddress, 'ethereum');
    expect(result).toBeDefined();
    expect(result?.healthFactor).toBe(Infinity);
  });

  it('reads real WETH price from Oracle', async () => {
    const monitor = new PriceMonitor(provider);
    // WETH address on Ethereum Mainnet
    const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    
    const result = await monitor.monitorAssetPrice(wethAddress, 'ethereum');
    expect(result).toBeDefined();
    expect(result?.price).toBeGreaterThan(0);
  });
});
