import { WorkflowStepAssignment, WorkflowStepResult } from './types';
import { WnodeClient } from '../client';
import { IntegrationRegistry } from '../integrations/registry';
export declare class MeshWorkflowCoordinator {
    private assignments;
    /**
     * Assigns a deterministic step to a worker node.
     */
    assignStep(assignment: WorkflowStepAssignment): void;
    getAssignments(): WorkflowStepAssignment[];
}
export declare class MeshWorkflowWorker {
    private client;
    private localNodeId;
    private integrationRegistry?;
    constructor(client: WnodeClient, localNodeId: string, registry?: IntegrationRegistry);
    /**
     * Deterministically executes an assigned step and produces a local ProofOfCompute.
     */
    executeStep(assignment: WorkflowStepAssignment): Promise<WorkflowStepResult>;
}
