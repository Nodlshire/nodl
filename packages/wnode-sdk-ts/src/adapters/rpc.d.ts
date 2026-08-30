import { ReadContractParams, WnodeClientConfig } from '../types';
export interface DeterministicRPCResponse {
    result: any;
    metadata: {
        chainId: number;
        timestamp: number;
        sdkVersion: string;
        blockTagUsed: string | number;
    };
}
export declare class DeterministicRPCAdapter {
    private config;
    private provider;
    constructor(config: WnodeClientConfig);
    /**
     * Deterministically executes an RPC read.
     */
    readContract(params: ReadContractParams): Promise<DeterministicRPCResponse>;
}
