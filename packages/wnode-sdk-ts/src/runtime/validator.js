"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeValidator = void 0;
const errors_1 = require("../errors");
class RuntimeValidator {
    config;
    constructor(config) {
        this.config = config;
    }
    /**
     * Validates incoming RPC read requests against strict determinism invariants.
     */
    validateReadContract(params) {
        const { blockTag } = params;
        if (this.config.strictDeterminism) {
            if (blockTag !== 'finalized' && !(typeof blockTag === 'object' && 'blockHash' in blockTag)) {
                throw new errors_1.WnodeDeterminismError('RUNTIME_VALIDATION_FAILED', {
                    reason: 'Strict mode requires finalized or blockHash blockTags.',
                    blockTag,
                    chainId: this.config.chainId,
                });
            }
        }
    }
    /**
     * Validates incoming workflow execution parameters.
     */
    validateWorkflowExecution(params) {
        if (!params.workflow) {
            throw new errors_1.WnodeDeterminismError('RUNTIME_VALIDATION_FAILED', {
                reason: 'Workflow ID is required for execution.',
                chainId: this.config.chainId,
            });
        }
        // In a real runtime, we would load the JSON workflow here and assert it contains determinism flags.
    }
    /**
     * Validates a Proof of Compute structure before it hits the audit pipeline.
     */
    validateProofOfCompute(proof) {
        if (!proof)
            return;
        if (proof.version !== '1.0') {
            throw new errors_1.WnodeDeterminismError('RUNTIME_VALIDATION_FAILED', {
                reason: 'Unsupported Proof of Compute version.',
                version: proof.version,
                chainId: this.config.chainId,
            });
        }
        if (!proof.stepHashes || proof.stepHashes.length === 0) {
            throw new errors_1.WnodeDeterminismError('RUNTIME_VALIDATION_FAILED', {
                reason: 'Proof of Compute must contain step hashes.',
                chainId: this.config.chainId,
            });
        }
    }
}
exports.RuntimeValidator = RuntimeValidator;
