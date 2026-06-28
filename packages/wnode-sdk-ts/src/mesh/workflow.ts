import { WorkflowStepAssignment, WorkflowStepResult } from './types';
import { WnodeClient } from '../client';
import { IntegrationRegistry } from '../integrations/registry';
import { ProofOfCompute } from '../types';
import * as crypto from 'crypto';
import { WnodeWorkflowError } from '../errors';

export class MeshWorkflowCoordinator {
  private assignments: Map<string, WorkflowStepAssignment> = new Map();

  /**
   * Assigns a deterministic step to a worker node.
   */
  public assignStep(assignment: WorkflowStepAssignment): void {
    this.assignments.set(assignment.stepId, assignment);
  }

  public getAssignments(): WorkflowStepAssignment[] {
    return Array.from(this.assignments.values());
  }
}

export class MeshWorkflowWorker {
  private client: WnodeClient;
  private localNodeId: string;
  private integrationRegistry?: IntegrationRegistry;

  constructor(client: WnodeClient, localNodeId: string, registry?: IntegrationRegistry) {
    this.client = client;
    this.localNodeId = localNodeId;
    this.integrationRegistry = registry;
  }

  /**
   * Deterministically executes an assigned step and produces a local ProofOfCompute.
   */
  public async executeStep(assignment: WorkflowStepAssignment): Promise<WorkflowStepResult> {
    if (assignment.nodeId !== this.localNodeId) {
      throw new WnodeWorkflowError('STEP_NOT_ASSIGNED_TO_NODE', {
        expected: this.localNodeId,
        received: assignment.nodeId
      });
    }

    // Execute through WnodeClient directly for strict determinism hooks
    const res = await this.client.executeWorkflow({
      workflow: JSON.stringify({
        version: "1.0",
        steps: [
          {
            id: assignment.stepId,
            action: assignment.action,
            params: { ...assignment.params, blockTag: assignment.blockTag }
          }
        ]
      }),
      params: {}
    });

    if (!res.proof) {
       throw new WnodeWorkflowError('PROOF_GENERATION_FAILED', {
         stepId: assignment.stepId,
         reason: 'Workflow execution did not produce a local proof'
       });
    }

    const stepHash = res.proof.stepHashes[0];

    let integrationPayloadHash: string | undefined;
    let integrationIntegrityProof: string | undefined;

    if (assignment.integrationName && this.integrationRegistry) {
      const adapter = this.integrationRegistry.getIntegration(assignment.integrationName);
      const op = assignment.integrationOperation || 'fetch';
      const res = await (adapter as any)[op](assignment.params);
      
      if (res.errorCode) {
        throw new WnodeWorkflowError('INTEGRITY_REJECTED', {
          stepId: assignment.stepId,
          reason: `Integration error: ${res.errorCode}`
        });
      }
      
      integrationPayloadHash = res.payloadHash;
      integrationIntegrityProof = res.integrityProof;
    }

    return {
      workflowId: assignment.workflowId,
      stepId: assignment.stepId,
      nodeId: this.localNodeId,
      stepHash,
      localProof: res.proof,
      integrationPayloadHash,
      integrationIntegrityProof
    };
  }
}
