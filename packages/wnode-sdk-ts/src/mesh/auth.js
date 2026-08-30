"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeshAuthRegistry = void 0;
class MeshAuthRegistry {
    trustedNodes = new Map();
    suspiciousNodes = new Set();
    // A simple static/config derived secret for simulating auth checks in Phase 1.6
    // No real private keys are handled here per constraints.
    configSecret = 'mesh-phase1.6-auth-secret';
    registerNode(descriptor) {
        if (this.validateDescriptor(descriptor)) {
            this.trustedNodes.set(descriptor.nodeId, descriptor);
            this.suspiciousNodes.delete(descriptor.nodeId);
        }
        else {
            this.suspiciousNodes.add(descriptor.nodeId);
            throw new Error(`Invalid authentication descriptor for node ${descriptor.nodeId}`);
        }
    }
    isTrusted(nodeId) {
        return this.trustedNodes.has(nodeId) && !this.suspiciousNodes.has(nodeId);
    }
    isSuspicious(nodeId) {
        return this.suspiciousNodes.has(nodeId);
    }
    markSuspicious(nodeId) {
        this.suspiciousNodes.add(nodeId);
        this.trustedNodes.delete(nodeId);
    }
    getNodeCapabilities(nodeId) {
        return this.trustedNodes.get(nodeId)?.capabilities || [];
    }
    validateDescriptor(descriptor) {
        if (!descriptor.nodeId || !descriptor.authToken || !descriptor.capabilities) {
            return false;
        }
        // In a deterministic simulation, the auth token should be derived predictably
        // Example: authToken = sha256(nodeId + secret). 
        // Here we just do a mock check to ensure it's structurally valid for the simulation
        const expectedPrefix = `auth-${descriptor.nodeId}-`;
        return descriptor.authToken.startsWith(expectedPrefix);
    }
}
exports.MeshAuthRegistry = MeshAuthRegistry;
