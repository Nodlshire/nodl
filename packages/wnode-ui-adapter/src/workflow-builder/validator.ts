import { UIResponse } from '../types';
import { normalizeUIError } from '../errors/normalize';

export class WorkflowValidator {
  /**
   * Validates a workflow JSON schema from the builder UI before saving or running.
   */
  public validateWorkflowSchema(workflowJson: any): UIResponse<boolean> {
    try {
      if (!workflowJson || typeof workflowJson !== 'object') {
        throw new Error('Invalid workflow object');
      }

      if (!workflowJson.version) {
        throw new Error('Workflow version is missing');
      }

      if (!Array.isArray(workflowJson.steps) || workflowJson.steps.length === 0) {
        throw new Error('Workflow must contain at least one step');
      }

      for (const step of workflowJson.steps) {
        if (!step.id || !step.action || !step.params) {
          throw new Error(`Step is missing required fields (id, action, params)`);
        }
      }

      return { ok: true, data: true };
    } catch (error: any) {
      return {
        ok: false,
        error: normalizeUIError(error),
      };
    }
  }
}
