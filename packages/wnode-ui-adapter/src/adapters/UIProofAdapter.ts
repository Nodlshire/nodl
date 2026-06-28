import { ProofOfCompute } from '@wnode/sdk';
import { UIResponse } from '../types';
import { normalizeUIError } from '../errors/normalize';

export class UIProofAdapter {
  /**
   * Validates and normalizes a ProofOfCompute for UI rendering.
   */
  public parseProof(proof: any): UIResponse<ProofOfCompute> {
    try {
      if (!proof || typeof proof !== 'object') {
        throw new Error('Invalid Proof of Compute payload.');
      }
      
      if (proof.version !== '1.0') {
        throw new Error('Unsupported Proof of Compute version.');
      }

      if (!proof.stepHashes || !Array.isArray(proof.stepHashes)) {
        throw new Error('Proof is missing step hashes.');
      }

      return { ok: true, data: proof as ProofOfCompute };
    } catch (error: any) {
      return {
        ok: false,
        error: normalizeUIError(error),
      };
    }
  }
}
