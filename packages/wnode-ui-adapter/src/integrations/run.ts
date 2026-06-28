import { UIWorkflowAdapter } from '../adapters/UIWorkflowAdapter';
import { ExecuteWorkflowParams, ExecuteWorkflowResult } from '@wnode/sdk';
import { UIResponse } from '../types';
import { IntegrationMetadata } from '../adapters/UIIntegrationAdapter';

export class IntegrationRunner {
  private adapter: UIWorkflowAdapter;

  constructor(adapter: UIWorkflowAdapter) {
    this.adapter = adapter;
  }

  /**
   * Prepares and previews the execution of a canonical integration module workflow.
   */
  public async previewIntegration(metadata: IntegrationMetadata, injectedParams: Record<string, any>): Promise<UIResponse<ExecuteWorkflowResult>> {
    if (!metadata.exampleWorkflow) {
      return {
        ok: false,
        error: {
          code: 'MISSING_WORKFLOW',
          message: 'Integration module does not define an example workflow.',
        }
      };
    }

    const execParams: ExecuteWorkflowParams = {
      workflow: JSON.stringify(metadata.exampleWorkflow),
      params: injectedParams,
    };

    return this.adapter.executePreview(execParams);
  }
}
