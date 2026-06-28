import { MeshNode } from '../../../../../packages/wnode-sdk-ts/src/mesh/node';
import { SecuritySnapshot } from '../../../../../packages/wnode-sdk-ts/src/mesh/health';
import { IncidentRecord } from '../../../../../packages/wnode-sdk-ts/src/mesh/byzantine';

export class UIMeshSecurityAdapter {
  constructor(private readonly meshNode: MeshNode) {}

  /**
   * Returns a high-level summary of the security status for UI rendering.
   */
  public getSecuritySnapshot(): SecuritySnapshot {
    return this.meshNode.getSecuritySnapshot();
  }

  /**
   * Returns a list of quarantined nodes (Byzantine detected).
   */
  public getQuarantinedNodes(): string[] {
    return this.meshNode.byzantine.getQuarantinedNodes();
  }

  /**
   * Retrieves the detailed incident log for a specific node.
   */
  public getIncidentLog(nodeId: string): IncidentRecord[] {
    return this.meshNode.byzantine.getIncidentLog(nodeId);
  }

  /**
   * Utility to check if a specific node is considered trusted.
   */
  public isTrusted(nodeId: string): boolean {
    return this.meshNode.auth.isTrusted(nodeId);
  }

  /**
   * Utility to check if a specific node is currently suspicious.
   */
  public isSuspicious(nodeId: string): boolean {
    return this.meshNode.auth.isSuspicious(nodeId);
  }
}
