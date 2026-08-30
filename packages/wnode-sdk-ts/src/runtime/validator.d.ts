import { ReadContractParams, ExecuteWorkflowParams, ProofOfCompute, WnodeClientConfig } from '../types';
export declare class RuntimeValidator {
    private config;
    constructor(config: WnodeClientConfig);
    /**
     * Validates incoming RPC read requests against strict determinism invariants.
     */
    validateReadContract(params: ReadContractParams): void;
    /**
     * Validates incoming workflow execution parameters.
     */
    validateWorkflowExecution(params: ExecuteWorkflowParams): void;
    /**
     * Validates a Proof of Compute structure before it hits the audit pipeline.
     */
    validateProofOfCompute(proof: ProofOfCompute | undefined): void;
}
