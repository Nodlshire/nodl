export interface NodeAuthDescriptor {
  nodeId: string;
  authToken: string;
  capabilities: string[];
}

export class MeshAuthRegistry {
  private trustedNodes: Map<string, NodeAuthDescriptor> = new Map();
  private suspiciousNodes: Set<string> = new Set();
  
  // A simple static/config derived secret for simulating auth checks in Phase 1.6
  // No real private keys are handled here per constraints.
  private readonly configSecret = 'mesh-phase1.6-auth-secret';

  public registerNode(descriptor: NodeAuthDescriptor): void {
    if (this.validateDescriptor(descriptor)) {
      this.trustedNodes.set(descriptor.nodeId, descriptor);
      this.suspiciousNodes.delete(descriptor.nodeId);
    } else {
      this.suspiciousNodes.add(descriptor.nodeId);
      throw new Error(`Invalid authentication descriptor for node ${descriptor.nodeId}`);
    }
  }

  public isTrusted(nodeId: string): boolean {
    return this.trustedNodes.has(nodeId) && !this.suspiciousNodes.has(nodeId);
  }

  public isSuspicious(nodeId: string): boolean {
    return this.suspiciousNodes.has(nodeId);
  }

  public markSuspicious(nodeId: string): void {
    this.suspiciousNodes.add(nodeId);
    this.trustedNodes.delete(nodeId);
  }

  public getNodeCapabilities(nodeId: string): string[] {
    return this.trustedNodes.get(nodeId)?.capabilities || [];
  }

  private validateDescriptor(descriptor: NodeAuthDescriptor): boolean {
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
