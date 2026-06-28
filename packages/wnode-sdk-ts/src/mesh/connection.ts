import { NetworkSecureTransport } from './transport_quic';
import { MeshAuthRegistry, NodeAuthDescriptor } from './auth';
import { MeshByzantineMonitor, ByzantineIncidentType } from './byzantine';

export class MeshConnectionManager {
  private peerMap: Map<string, string> = new Map(); // peerAddress -> nodeId

  constructor(
    private readonly transport: NetworkSecureTransport,
    private readonly authRegistry: MeshAuthRegistry,
    private readonly byzantineMonitor: MeshByzantineMonitor
  ) {}

  public async connectToPeer(peerAddress: string, authDesc: NodeAuthDescriptor): Promise<void> {
    // 1. Check if node is quarantined before attempting connection
    if (this.byzantineMonitor.isByzantine(authDesc.nodeId)) {
      console.warn(`[ConnectionManager] Rejecting quarantined node: ${authDesc.nodeId}`);
      return;
    }

    // 2. Validate capabilities & auth token via Registry
    try {
      this.authRegistry.registerNode(authDesc);
    } catch (err) {
      this.byzantineMonitor.recordIncident(authDesc.nodeId, ByzantineIncidentType.INVALID_INTEGRITY_PROOF, 'Invalid connection auth');
      console.warn(`[ConnectionManager] Connection rejected for ${authDesc.nodeId}: Auth failed`);
      return;
    }

    // 3. Inform transport layer
    await this.transport.connect(peerAddress);
    this.peerMap.set(peerAddress, authDesc.nodeId);
    
    this.onPeerConnected(peerAddress, authDesc.nodeId);
  }

  public async disconnectFromPeer(peerAddress: string): Promise<void> {
    const nodeId = this.peerMap.get(peerAddress);
    if (nodeId) {
      this.peerMap.delete(peerAddress);
      await this.transport.disconnect(peerAddress);
      this.onPeerDisconnected(peerAddress, nodeId);
    }
  }

  public getConnectedNodeIds(): string[] {
    return Array.from(this.peerMap.values());
  }

  private onPeerConnected(address: string, nodeId: string): void {
    // Hooks for observability
  }

  private onPeerDisconnected(address: string, nodeId: string): void {
    // Hooks for observability
  }
}
