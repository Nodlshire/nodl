import { HealthMonitor } from './aave_automation/health_monitor';
import { LiquidationDetector } from './aave_automation/liquidation_detector';
import { LiquidationExecutor } from './aave_automation/liquidation_executor';
import { IdleRouter } from './aave_automation/idle_router';
import { PriceMonitor } from './aave_automation/price_monitor';
import { AAVE_CONFIG } from './config';

export const int_aave_v3 = {
  ping() {
    return "Aave V3 integration loaded with automation capabilities.";
  },
  
  config: AAVE_CONFIG,

  // Module factories
  createHealthMonitor(provider: any) {
    return new HealthMonitor(provider);
  },
  createLiquidationDetector() {
    return new LiquidationDetector();
  },
  createLiquidationExecutor(signer: any) {
    return new LiquidationExecutor(signer);
  },
  createIdleRouter(signer: any) {
    return new IdleRouter(signer);
  },
  createPriceMonitor(provider: any) {
    return new PriceMonitor(provider);
  }
};
