import { Contract, Signer } from 'ethers';
import { AAVE_CONFIG } from '../config';
import { AavePoolABI } from '../abi';

/**
 * Idle Balance Router Module
 * Detects idle balances in a Wnode-controlled or user-approved wallet and routes them to Aave for yield.
 */
export class IdleRouter {
  constructor(private signer: Signer) {}

  /**
   * Deposits an idle balance into an Aave pool.
   */
  async routeIdleBalance(asset: string, amount: string, onBehalfOf: string, network: 'ethereum' | 'arbitrum' = 'ethereum') {
    if (!AAVE_CONFIG.ENABLE_AAVE_AUTO_ROUTING) {
      console.log("[Aave IdleRouter] Disabled by feature flag: ENABLE_AAVE_AUTO_ROUTING is false.");
      return null;
    }

    console.log(`[Aave IdleRouter] Routing ${amount} of ${asset} to Aave on behalf of ${onBehalfOf}`);
    
    const poolAddress = AAVE_CONFIG.NETWORKS[network].Pool;
    const pool = new Contract(poolAddress, AavePoolABI, this.signer);
    
    const tx = await pool.supply(asset, amount, onBehalfOf, 0);
    await tx.wait();

    return { success: true, action: 'supply', amount, asset, txHash: tx.hash };
  }

  /**
   * Withdraws funds from an Aave pool.
   */
  async withdrawBalance(asset: string, amount: string, to: string, network: 'ethereum' | 'arbitrum' = 'ethereum') {
    if (!AAVE_CONFIG.ENABLE_AAVE_AUTO_ROUTING) {
      throw new Error("[Aave IdleRouter] Execution blocked: ENABLE_AAVE_AUTO_ROUTING is false.");
    }

    console.log(`[Aave IdleRouter] Withdrawing ${amount} of ${asset} from Aave to ${to}`);
    
    const poolAddress = AAVE_CONFIG.NETWORKS[network].Pool;
    const pool = new Contract(poolAddress, AavePoolABI, this.signer);
    
    const tx = await pool.withdraw(asset, amount, to);
    await tx.wait();
    
    return { success: true, action: 'withdraw', amount, asset, txHash: tx.hash };
  }
}
