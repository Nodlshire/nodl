export interface WnodeClientConfig {
  endpoint: string;
  chainId: number;
  sdkVersion: string;
  apiVersion: string;
  /**
   * Enforces strict determinism. If true, rejecting any blockTag that is not 'finalized' or { blockHash: string }.
   * @default true
   */
  strictDeterminism?: boolean;
}

export type BlockTag = 'finalized' | { blockHash: string } | { blockNumber: number };

export interface ReadContractParams {
  address: string;
  abi: any | string;
  functionName: string;
  args?: any[];
  blockTag?: BlockTag;
}

export interface BuildCalldataParams {
  address: string;
  abi: any | string;
  functionName: string;
  args?: any[];
}

export interface CalldataResult {
  to: string;
  data: string;
  value?: string;
  chainId: number;
  sdkVersion: string;
  simulationResult?: any;
}

export interface ExecuteWorkflowParams {
  workflow: string;
  params: Record<string, any>;
}

export interface ExecuteWorkflowResult {
  result: any;
  proof?: ProofOfCompute;
  logs?: any[];
}

export interface AuditEntry {
  proof?: ProofOfCompute;
  event?: string;
  context?: any;
  chainId: number;
  sdkVersion: string;
  timestamp: number;
}

/**
 * The canonical ProofOfCompute schema.
 */
export interface ProofOfCompute {
  version: string;
  workflowId: string;
  stepHashes: string[];
  merkleRoot?: string;
  timestamp: number;
  chainId: number;
  blockTag: {
    finalized?: boolean;
    blockHash?: string;
    blockNumber?: number;
  };
  signature?: string;
}

export interface VerifiedPrice {
  price: number;
  updatedAt: number;
  roundId: string;
  feed: string;
  chainId: number;
  sdkVersion: string;
  timestamp: number;
}
