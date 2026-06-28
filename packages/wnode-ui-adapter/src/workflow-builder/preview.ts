import { UIWorkflowAdapter } from '../adapters/UIWorkflowAdapter';
import { ExecuteWorkflowParams, ExecuteWorkflowResult } from '@wnode/sdk';
import { UIResponse } from '../types';

export class WorkflowPreviewer {
  private adapter: UIWorkflowAdapter;

  constructor(adapter: UIWorkflowAdapter) {
    this.adapter = adapter;
  }

  /**
   * Previews a workflow execution deterministically.
   * This is safe for UI components as it wraps the raw output.
   */
  public async previewWorkflow(params: ExecuteWorkflowParams): Promise<UIResponse<ExecuteWorkflowResult>> {
    // We can inject UI-specific preview parameters here if needed
    return this.adapter.executePreview(params);
  }
}
