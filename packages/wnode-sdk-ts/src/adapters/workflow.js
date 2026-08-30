"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowEngineAdapter = void 0;
const ethers_1 = require("ethers");
const errors_1 = require("../errors");
class WorkflowEngineAdapter {
    config;
    constructor(config) {
        this.config = config;
    }
    /**
     * Loads and executes a JSON workflow deterministically.
     */
    async executeWorkflow(params) {
        const { workflow, params: workflowParams } = params;
        // Strict determinism mode enforces a finalized default block tag for the workflow run if not provided
        const blockTag = this.config.strictDeterminism ? 'finalized' : { blockNumber: 0 }; // 0 represents latest in some contexts, but ideally should be explicit
        try {
            // 1. Load workflow by ID (Mocked for this implementation)
            if (!workflow)
                throw new Error('Workflow ID missing');
            // 2. Execute steps deterministically (Mocking step execution)
            const stepInput = JSON.stringify(workflowParams);
            const stepOutput = JSON.stringify({ success: true, mocked: true });
            // 3. Compute step hashes: hash(stepInput + stepOutput + blockTag)
            const blockTagString = typeof blockTag === 'string' ? blockTag : JSON.stringify(blockTag);
            const payloadToHash = stepInput + stepOutput + blockTagString;
            const stepHash = ethers_1.ethers.keccak256(ethers_1.ethers.toUtf8Bytes(payloadToHash));
            const stepHashes = [stepHash];
            // 4. Compute Merkle Root (Mocked as single leaf for now)
            const merkleRoot = stepHash; // Simple for one step
            // 5. Construct ProofOfCompute
            const proofBlockTag = typeof blockTag === 'string' && blockTag === 'finalized'
                ? { finalized: true }
                : blockTag;
            const proof = {
                version: '1.0',
                workflowId: workflow,
                stepHashes,
                merkleRoot,
                timestamp: Math.floor(Date.now() / 1000),
                chainId: this.config.chainId,
                blockTag: proofBlockTag,
            };
            return {
                result: JSON.parse(stepOutput),
                proof,
                logs: ['Workflow started', 'Step 1 completed'],
            };
        }
        catch (err) {
            throw new errors_1.WnodeWorkflowError('WORKFLOW_EXECUTION_FAILED', {
                workflow,
                error: err.message,
                chainId: this.config.chainId,
                timestamp: Math.floor(Date.now() / 1000),
                sdkVersion: this.config.sdkVersion,
            });
        }
    }
}
exports.WorkflowEngineAdapter = WorkflowEngineAdapter;
