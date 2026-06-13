import { Contract, Signer } from 'ethers';
import { AAVE_CONFIG } from '../config';
import { AavePoolABI } from '../abi';

/**
 * Liquidation Executor Module
 * Handles the actual call flow to Aave's liquidation functions.
 * STRICTLY PROTECTED by ENABLE_AAVE_LIQUIDATIONS.
 */
export class LiquidationExecutor {
  constructor(private signer: Signer) {}

  /**
   * Executes a liquidation call. Fails safely if the feature flag is disabled.
   * Can perform a simulated dry-run if requested.
   */
  async executeLiquidation(candidate: any, network: 'ethereum' | 'arbitrum' = 'ethereum', dryRun: boolean = true) {
    if (!AAVE_CONFIG.ENABLE_AAVE_LIQUIDATIONS) {
      throw new Error("[Aave LiquidationExecutor] Execution blocked: ENABLE_AAVE_LIQUIDATIONS is false.");
    }

    console.log(`[Aave LiquidationExecutor] Preparing to liquidate ${candidate.user}`);
    
    const poolAddress = AAVE_CONFIG.NETWORKS[network].Pool;
    const poolContract = new Contract(poolAddress, AavePoolABI, this.signer);
    
    if (dryRun) {
      console.log("[Aave LiquidationExecutor] Dry-run mode: Simulating transaction...");
      // In dry run, we use staticCall to simulate without broadcasting
      try {
        await poolContract.liquidationCall.staticCall(
          candidate.collateralAsset, 
          candidate.debtAsset, 
          candidate.user, 
          candidate.debtToCover, 
          candidate.receiveAToken
        );
        console.log("[Aave LiquidationExecutor] Dry-run successful.");
        return { success: true, simulated: true, txHash: null };
      } catch (e) {
        console.error("[Aave LiquidationExecutor] Dry-run failed.", e);
        throw e;
      }
    }

    console.log("[Aave LiquidationExecutor] EXECUTING REAL LIQUIDATION...");
    const tx = await poolContract.liquidationCall(
      candidate.collateralAsset, 
      candidate.debtAsset, 
      candidate.user, 
      candidate.debtToCover, 
      candidate.receiveAToken
    );
    await tx.wait();

    return { success: true, simulated: false, txHash: tx.hash };
  }
}
