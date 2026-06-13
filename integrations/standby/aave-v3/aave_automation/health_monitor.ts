import { Contract, Provider } from 'ethers';
import { AAVE_CONFIG } from '../config';
import { AavePoolABI } from '../abi';

/**
 * Health Monitor Module
 * Reads user position data from Aave to compute and monitor health factors.
 */
export class HealthMonitor {
  constructor(private provider: Provider) {}

  /**
   * Checks the health factor of a given user.
   * Emits warnings if the HF drops below the configured critical threshold.
   */
  async checkHealthFactor(userAddress: string, network: 'ethereum' | 'arbitrum' = 'ethereum') {
    if (!AAVE_CONFIG.ENABLE_AAVE_HEALTH_MONITORING) {
      console.log("[Aave HealthMonitor] Disabled by feature flag.");
      return null;
    }

    try {
      const poolAddress = AAVE_CONFIG.NETWORKS[network].Pool;
      const poolContract = new Contract(poolAddress, AavePoolABI, this.provider);
      
      const accountData = await poolContract.getUserAccountData(userAddress);
      
      // Aave returns healthFactor scaled by 1e18
      const hfBigInt = accountData.healthFactor;
      
      // If healthFactor is MaxUint256, the user has no debt
      if (hfBigInt.toString() === "115792089237316195423570985008687907853269984665640564039457584007913129639935") {
         return {
           user: userAddress,
           healthFactor: Infinity,
           timestamp: Date.now()
         };
      }

      const healthFactor = Number(hfBigInt) / 1e18;
      
      if (healthFactor < AAVE_CONFIG.THRESHOLDS.CRITICAL_HEALTH_FACTOR) {
        console.warn(`[Aave HealthMonitor] WARNING: User ${userAddress} health factor is critical: ${healthFactor}`);
        // Emit internal event/telemetry here
      }

      return {
        user: userAddress,
        healthFactor,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`[Aave HealthMonitor] Error fetching health factor for ${userAddress}:`, error);
      throw error;
    }
  }
}
