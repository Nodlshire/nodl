import { WorkflowStepResult } from './types';
import { ProofOfCompute } from '../types';
export declare class MeshProofAggregator {
    /**
     * Deterministically aggregates an array of local step proofs into a final workflow ProofOfCompute.
     */
    aggregateProofs(workflowId: string, results: WorkflowStepResult[], chainId: number, blockTag: any): ProofOfCompute;
    private computeMerkleRoot;
}
