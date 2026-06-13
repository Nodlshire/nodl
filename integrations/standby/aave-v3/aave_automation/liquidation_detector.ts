import { AAVE_CONFIG } from '../config';

/**
 * Liquidation Detector Module
 * Scans positions to find opportunities where Health Factor < 1.0.
 */
export class LiquidationDetector {
  /**
   * Evaluates a list of positions and returns candidates eligible for liquidation.
   */
  async findCandidates(positions: {user: string, hf: number, collateralAsset: string, debtAsset: string, debtAmount: string}[]) {
    // Note: Finding candidates does not strictly require the execution flag to be true, 
    // but typically we only run this if we plan to liquidate or track opportunities.
    
    const candidates = [];

    for (const pos of positions) {
      if (pos.hf < AAVE_CONFIG.THRESHOLDS.LIQUIDATION_HEALTH_FACTOR) {
        // Prepare a "liquidation candidate" object
        candidates.push({
          user: pos.user,
          collateralAsset: pos.collateralAsset,
          debtAsset: pos.debtAsset,
          debtToCover: pos.debtAmount, // In reality, we'd calculate up to 50% or 100% based on close factor
          receiveAToken: false,
          estimatedBonusUsd: 0 // Mocked. Requires oracle prices to calculate.
        });
      }
    }

    return candidates;
  }
}
