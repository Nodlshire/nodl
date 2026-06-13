import { Contract, Provider } from 'ethers';
import { AAVE_CONFIG } from '../config';
import { AaveOracleABI } from '../abi';

/**
 * Price & Oracle Monitor Module
 * Reads price data from Aave's official Oracle feeds to monitor anomalies.
 */
export class PriceMonitor {
  constructor(private provider: Provider) {}

  /**
   * Fetches the price of a specific asset from the Aave Oracle.
   */
  async monitorAssetPrice(assetAddress: string, network: 'ethereum' | 'arbitrum' = 'ethereum') {
    if (!AAVE_CONFIG.ENABLE_AAVE_PRICE_MONITORING) {
      console.log("[Aave PriceMonitor] Disabled by feature flag.");
      return null;
    }

    try {
      const oracleAddress = AAVE_CONFIG.NETWORKS[network].Oracle;
      const oracle = new Contract(oracleAddress, AaveOracleABI, this.provider);
      
      const priceBigInt = await oracle.getAssetPrice(assetAddress);
      
      // Aave USD oracles typically use 8 decimals
      const priceFormatted = Number(priceBigInt) / 1e8;
      
      console.log(`[Aave PriceMonitor] Asset ${assetAddress} price is $${priceFormatted}`);
      
      return {
        asset: assetAddress,
        price: priceFormatted,
        timestamp: Date.now(),
        source: oracleAddress
      };
    } catch (error) {
      console.error(`[Aave PriceMonitor] Error fetching price for ${assetAddress}:`, error);
      throw error;
    }
  }
}
