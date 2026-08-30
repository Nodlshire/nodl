"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeshWorkflowWorker = exports.MeshWorkflowCoordinator = void 0;
const errors_1 = require("../errors");
class MeshWorkflowCoordinator {
    assignments = new Map();
    /**
     * Assigns a deterministic step to a worker node.
     */
    assignStep(assignment) {
        this.assignments.set(assignment.stepId, assignment);
    }
    getAssignments() {
        return Array.from(this.assignments.values());
    }
}
exports.MeshWorkflowCoordinator = MeshWorkflowCoordinator;
class MeshWorkflowWorker {
    client;
    localNodeId;
    integrationRegistry;
    constructor(client, localNodeId, registry) {
        this.client = client;
        this.localNodeId = localNodeId;
        this.integrationRegistry = registry;
    }
    /**
     * Deterministically executes an assigned step and produces a local ProofOfCompute.
     */
    async executeStep(assignment) {
        if (assignment.nodeId !== this.localNodeId) {
            throw new errors_1.WnodeWorkflowError('STEP_NOT_ASSIGNED_TO_NODE', {
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
            throw new errors_1.WnodeWorkflowError('PROOF_GENERATION_FAILED', {
                stepId: assignment.stepId,
                reason: 'Workflow execution did not produce a local proof'
            });
        }
        const stepHash = res.proof.stepHashes[0];
        let integrationPayloadHash;
        let integrationIntegrityProof;
        if (assignment.integrationName && this.integrationRegistry) {
            const adapter = this.integrationRegistry.getIntegration(assignment.integrationName);
            const op = assignment.integrationOperation || 'fetch';
            const res = await adapter[op](assignment.params);
            if (res.errorCode) {
                throw new errors_1.WnodeWorkflowError('INTEGRITY_REJECTED', {
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
exports.MeshWorkflowWorker = MeshWorkflowWorker;
