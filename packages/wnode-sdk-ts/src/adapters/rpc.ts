import { ethers } from 'ethers';
import { ReadContractParams, WnodeClientConfig } from '../types';
import { WnodeDeterminismError, WnodeError } from '../errors';

export interface DeterministicRPCResponse {
  result: any;
  metadata: {
    chainId: number;
    timestamp: number;
    sdkVersion: string;
    blockTagUsed: string | number;
  };
}

export class DeterministicRPCAdapter {
  private config: WnodeClientConfig;
  private provider: ethers.JsonRpcProvider;

  constructor(config: WnodeClientConfig) {
    this.config = config;
    this.provider = new ethers.JsonRpcProvider(config.endpoint);
  }

  /**
   * Deterministically executes an RPC read.
   */
  public async readContract(params: ReadContractParams): Promise<DeterministicRPCResponse> {
    const { address, abi, functionName, args = [], blockTag = 'finalized' } = params;

    // Strict Mode Enforcement
    if (this.config.strictDeterminism) {
      if (blockTag !== 'finalized' && !(typeof blockTag === 'object' && 'blockHash' in blockTag)) {
        throw new WnodeDeterminismError('UNSAFE_BLOCKTAG', {
          blockTag,
          chainId: this.config.chainId,
          timestamp: Math.floor(Date.now() / 1000),
          sdkVersion: this.config.sdkVersion,
        });
      }
    } else {
      if (typeof blockTag === 'object' && 'blockNumber' in blockTag) {
        console.warn('[Wnode WARNING] Unsafe blockTag used — determinism may degrade.');
      }
    }

    try {
      const contract = new ethers.Contract(address, typeof abi === 'string' ? [abi] : abi, this.provider);
      
      // Parse blockTag for ethers
      let ethersBlockTag: ethers.BlockTag = 'finalized';
      if (typeof blockTag === 'object') {
        if ('blockHash' in blockTag) {
          ethersBlockTag = blockTag.blockHash;
        } else if ('blockNumber' in blockTag) {
          ethersBlockTag = blockTag.blockNumber;
        }
      } else {
        ethersBlockTag = blockTag;
      }

      // Simulate determinism by enforcing blockTag on the call
      const result = await contract[functionName](...args, { blockTag: ethersBlockTag });

      // In a true Wnode implementation, we would hash the payload and ensure no changes across retries.
      // Here we just return the result with strict metadata.
      return {
        result,
        metadata: {
          chainId: this.config.chainId,
          timestamp: Math.floor(Date.now() / 1000),
          sdkVersion: this.config.sdkVersion,
          blockTagUsed: typeof ethersBlockTag === 'string' ? ethersBlockTag : ethersBlockTag.toString(),
        },
      };

    } catch (err: any) {
      if (err instanceof WnodeDeterminismError) throw err;
      throw new WnodeDeterminismError('NON_DETERMINISTIC_RPC', {
        error: err.message,
        address,
        functionName,
        blockTag,
        chainId: this.config.chainId,
        timestamp: Math.floor(Date.now() / 1000),
        sdkVersion: this.config.sdkVersion,
      });
    }
  }
}
