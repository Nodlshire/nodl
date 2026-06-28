import { UIProofAdapter } from '../adapters/UIProofAdapter';
import { ProofOfCompute } from '@wnode/sdk';
import { UIResponse } from '../types';

export class ProofViewer {
  private adapter: UIProofAdapter;

  constructor(adapter: UIProofAdapter) {
    this.adapter = adapter;
  }

  /**
   * Prepares the Proof of Compute for UI rendering.
   * Ensures all determinism fields are safely mapped for the frontend.
   */
  public prepareForDisplay(rawProof: any): UIResponse<ProofOfCompute> {
    const res = this.adapter.parseProof(rawProof);
    if (!res.ok || !res.data) {
      return res;
    }

    // Additional viewer-specific sanitization or formatting can occur here
    // e.g., mapping blockTag to a display string if it's an object

    return res;
  }

  /**
   * Serializes the proof safely for export (UI download).
   */
  public exportProof(proof: ProofOfCompute): string {
    return JSON.stringify(proof, null, 2);
  }
}
