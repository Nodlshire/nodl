import { MeshNode } from '../../../../../packages/wnode-sdk-ts/src/mesh/node';

export class UIIntegrationWorkflowAdapter {
  constructor(private readonly meshNode: MeshNode) {}

  public getWorkflowsUsingIntegrations() {
    const assignments = this.meshNode.coordinator.getAssignments();
    return assignments.filter(a => a.integrationName !== undefined);
  }

  public getTracesForWorkflow(workflowId: string) {
    const assignments = this.meshNode.coordinator.getAssignments();
    return assignments.filter(a => a.workflowId === workflowId && a.integrationName !== undefined);
  }
}
