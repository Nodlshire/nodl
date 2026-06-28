import { ReadContractParams, ExecuteWorkflowParams, ProofOfCompute, WnodeClientConfig } from '../types';
import { WnodeDeterminismError } from '../errors';

export class RuntimeValidator {
  private config: WnodeClientConfig;

  constructor(config: WnodeClientConfig) {
    this.config = config;
  }

  /**
   * Validates incoming RPC read requests against strict determinism invariants.
   */
  public validateReadContract(params: ReadContractParams): void {
    const { blockTag } = params;

    if (this.config.strictDeterminism) {
      if (blockTag !== 'finalized' && !(typeof blockTag === 'object' && 'blockHash' in blockTag)) {
        throw new WnodeDeterminismError('RUNTIME_VALIDATION_FAILED', {
          reason: 'Strict mode requires finalized or blockHash blockTags.',
          blockTag,
          chainId: this.config.chainId,
        });
      }
    }
  }

  /**
   * Validates incoming workflow execution parameters.
   */
  public validateWorkflowExecution(params: ExecuteWorkflowParams): void {
    if (!params.workflow) {
      throw new WnodeDeterminismError('RUNTIME_VALIDATION_FAILED', {
        reason: 'Workflow ID is required for execution.',
        chainId: this.config.chainId,
      });
    }

    // In a real runtime, we would load the JSON workflow here and assert it contains determinism flags.
  }

  /**
   * Validates a Proof of Compute structure before it hits the audit pipeline.
   */
  public validateProofOfCompute(proof: ProofOfCompute | undefined): void {
    if (!proof) return;

    if (proof.version !== '1.0') {
      throw new WnodeDeterminismError('RUNTIME_VALIDATION_FAILED', {
        reason: 'Unsupported Proof of Compute version.',
        version: proof.version,
        chainId: this.config.chainId,
      });
    }

    if (!proof.stepHashes || proof.stepHashes.length === 0) {
      throw new WnodeDeterminismError('RUNTIME_VALIDATION_FAILED', {
        reason: 'Proof of Compute must contain step hashes.',
        chainId: this.config.chainId,
      });
    }
  }
}
