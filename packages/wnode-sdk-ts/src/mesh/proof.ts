import { WorkflowStepResult } from './types';
import { ProofOfCompute } from '../types';
import { WnodeDeterminismError } from '../errors';
import * as crypto from 'crypto';

export class MeshProofAggregator {
  
  /**
   * Deterministically aggregates an array of local step proofs into a final workflow ProofOfCompute.
   */
  public aggregateProofs(workflowId: string, results: WorkflowStepResult[], chainId: number, blockTag: any): ProofOfCompute {
    if (results.length === 0) {
      throw new WnodeDeterminismError('PROOF_AGGREGATION_FAILED', {
        reason: 'No results provided for aggregation'
      });
    }

    // Sort results by stepId to ensure deterministic ordering of the Merkle Tree
    const sortedResults = [...results].sort((a, b) => a.stepId.localeCompare(b.stepId));

    const stepHashes: string[] = [];

    for (const res of sortedResults) {
      if (res.workflowId !== workflowId) {
         throw new WnodeDeterminismError('PROOF_AGGREGATION_FAILED', {
           reason: 'WorkflowId mismatch in results',
           expected: workflowId,
           received: res.workflowId
         });
      }

      if (!res.localProof || res.localProof.version !== '1.0' || !res.localProof.stepHashes.length) {
         throw new WnodeDeterminismError('PROOF_AGGREGATION_FAILED', {
           reason: 'Invalid local proof schema or version',
           stepId: res.stepId
         });
      }

      stepHashes.push(res.stepHash);
    }

    const merkleRoot = this.computeMerkleRoot(stepHashes);

    return {
      version: '1.0',
      workflowId,
      stepHashes,
      merkleRoot,
      timestamp: Math.floor(Date.now() / 1000),
      chainId,
      blockTag
    };
  }

  private computeMerkleRoot(hashes: string[]): string {
    const hashPayload = hashes.join('');
    return '0x' + crypto.createHash('sha256').update(hashPayload).digest('hex');
  }
}
