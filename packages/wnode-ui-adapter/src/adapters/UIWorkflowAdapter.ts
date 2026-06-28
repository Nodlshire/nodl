import { WnodeClient, ExecuteWorkflowParams, ExecuteWorkflowResult } from '@wnode/sdk';
import { UIResponse } from '../types';
import { normalizeUIError } from '../errors/normalize';

export class UIWorkflowAdapter {
  private client: WnodeClient;

  constructor(client: WnodeClient) {
    this.client = client;
  }

  /**
   * Deterministically executes or previews a workflow execution for the UI.
   * Catches all determinism and execution errors, mapping them to the UIResponse schema.
   */
  public async executePreview(params: ExecuteWorkflowParams): Promise<UIResponse<ExecuteWorkflowResult>> {
    try {
      const result = await this.client.executeWorkflow(params);
      return { ok: true, data: result };
    } catch (error: any) {
      return {
        ok: false,
        error: normalizeUIError(error),
      };
    }
  }
}
