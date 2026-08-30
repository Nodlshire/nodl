"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeshProofAggregator = void 0;
const errors_1 = require("../errors");
const crypto = __importStar(require("crypto"));
class MeshProofAggregator {
    /**
     * Deterministically aggregates an array of local step proofs into a final workflow ProofOfCompute.
     */
    aggregateProofs(workflowId, results, chainId, blockTag) {
        if (results.length === 0) {
            throw new errors_1.WnodeDeterminismError('PROOF_AGGREGATION_FAILED', {
                reason: 'No results provided for aggregation'
            });
        }
        // Sort results by stepId to ensure deterministic ordering of the Merkle Tree
        const sortedResults = [...results].sort((a, b) => a.stepId.localeCompare(b.stepId));
        const stepHashes = [];
        for (const res of sortedResults) {
            if (res.workflowId !== workflowId) {
                throw new errors_1.WnodeDeterminismError('PROOF_AGGREGATION_FAILED', {
                    reason: 'WorkflowId mismatch in results',
                    expected: workflowId,
                    received: res.workflowId
                });
            }
            if (!res.localProof || res.localProof.version !== '1.0' || !res.localProof.stepHashes.length) {
                throw new errors_1.WnodeDeterminismError('PROOF_AGGREGATION_FAILED', {
                    reason: 'Invalid local proof schema or version',
                    stepId: res.stepId
                });
            }
            stepHashes.push(res.stepHash);
        }
        const merkleRoot = this.computeMerkleRoot(stepHashes);
        return {
            version: '1.0',
            workflowId,
            stepHashes,
            merkleRoot,
            timestamp: Math.floor(Date.now() / 1000),
            chainId,
            blockTag
        };
    }
    computeMerkleRoot(hashes) {
        const hashPayload = hashes.join('');
        return '0x' + crypto.createHash('sha256').update(hashPayload).digest('hex');
    }
}
exports.MeshProofAggregator = MeshProofAggregator;
