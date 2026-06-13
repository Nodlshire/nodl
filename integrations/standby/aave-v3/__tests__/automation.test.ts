import { HealthMonitor } from '../aave_automation/health_monitor';
import { LiquidationDetector } from '../aave_automation/liquidation_detector';
import { LiquidationExecutor } from '../aave_automation/liquidation_executor';
import { IdleRouter } from '../aave_automation/idle_router';
import { PriceMonitor } from '../aave_automation/price_monitor';
import { AAVE_CONFIG } from '../config';

describe('Aave Automation Modules', () => {
  
  beforeEach(() => {
    AAVE_CONFIG.ENABLE_AAVE_HEALTH_MONITORING = false;
    AAVE_CONFIG.ENABLE_AAVE_LIQUIDATIONS = false;
    AAVE_CONFIG.ENABLE_AAVE_AUTO_ROUTING = false;
    AAVE_CONFIG.ENABLE_AAVE_PRICE_MONITORING = false;
  });

  // Dummy mock provider to satisfy constructor types
  const mockProvider = {} as any;
  const mockSigner = {} as any;

  describe('HealthMonitor', () => {
    it('returns null when flag is disabled', async () => {
      const monitor = new HealthMonitor(mockProvider);
      const result = await monitor.checkHealthFactor("0x123");
      expect(result).toBeNull();
    });
  });

  describe('LiquidationDetector', () => {
    it('identifies candidates with health factor < 1.0', async () => {
      const detector = new LiquidationDetector();
      const mockPositions = [
        { user: "0x1", hf: 1.5, collateralAsset: "0xA", debtAsset: "0xB", debtAmount: "100" },
        { user: "0x2", hf: 0.95, collateralAsset: "0xA", debtAsset: "0xB", debtAmount: "100" },
      ];
      
      const candidates = await detector.findCandidates(mockPositions);
      expect(candidates.length).toBe(1);
      expect(candidates[0].user).toBe("0x2");
    });
  });

  describe('LiquidationExecutor', () => {
    it('throws error when ENABLE_AAVE_LIQUIDATIONS is false', async () => {
      const executor = new LiquidationExecutor(mockSigner);
      await expect(executor.executeLiquidation({user: "0x2"})).rejects.toThrow();
    });
  });

  describe('IdleRouter', () => {
    it('returns null for routeIdleBalance when disabled', async () => {
      const router = new IdleRouter(mockSigner);
      const result = await router.routeIdleBalance("0xA", "100", "0x1");
      expect(result).toBeNull();
    });

    it('throws error for withdrawBalance when disabled', async () => {
      const router = new IdleRouter(mockSigner);
      await expect(router.withdrawBalance("0xA", "100", "0x1")).rejects.toThrow();
    });
  });

  describe('PriceMonitor', () => {
    it('returns null when disabled', async () => {
      const monitor = new PriceMonitor(mockProvider);
      const result = await monitor.monitorAssetPrice("0xA");
      expect(result).toBeNull();
    });
  });
});
