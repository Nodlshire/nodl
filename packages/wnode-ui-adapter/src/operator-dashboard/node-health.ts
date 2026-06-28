import { UIResponse } from '../types';
import { WnodeClientConfig } from '@wnode/sdk';

export interface NodeHealthStatus {
  status: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  rpcEndpoint: string;
  strictDeterminism: boolean;
  chainId: number;
}

export class DashboardNodeHealthSurface {
  private config: WnodeClientConfig;

  constructor(config: WnodeClientConfig) {
    this.config = config;
  }

  /**
   * Checks the health of the sovereign node determinism configuration.
   */
  public getHealth(): UIResponse<NodeHealthStatus> {
    const isStrict = this.config.strictDeterminism ?? true;
    
    // In a real environment, this would ping the RPC endpoint to ensure it supports finalized blocks.
    const status: NodeHealthStatus['status'] = isStrict ? 'HEALTHY' : 'DEGRADED';

    return {
      ok: true,
      data: {
        status,
        rpcEndpoint: this.config.endpoint ? 'CONFIGURED' : 'MISSING',
        strictDeterminism: isStrict,
        chainId: this.config.chainId,
      }
    };
  }
}
