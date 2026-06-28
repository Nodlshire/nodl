import { PeerInfo } from './types';
import { WnodeDeterminismError } from '../errors';

export class MeshDiscovery {
  private localNodeId: string;
  private sdkVersion: string;
  private protocolVersion: string;
  private peers: Map<string, PeerInfo> = new Map();

  constructor(localNodeId: string, sdkVersion: string, protocolVersion: string = '1.0') {
    this.localNodeId = localNodeId;
    this.sdkVersion = sdkVersion;
    this.protocolVersion = protocolVersion;
  }

  public getLocalNodeId(): string {
    return this.localNodeId;
  }

  public getPeers(): PeerInfo[] {
    return Array.from(this.peers.values());
  }

  public handleHeartbeat(peer: PeerInfo): void {
    if (peer.nodeId === this.localNodeId) return;

    if (peer.sdkVersion !== this.sdkVersion) {
      throw new WnodeDeterminismError('PEER_REJECTED', {
        reason: 'mismatched sdkVersion',
        peerId: peer.nodeId,
        expected: this.sdkVersion,
        received: peer.sdkVersion
      });
    }

    if (peer.protocolVersion !== this.protocolVersion) {
      throw new WnodeDeterminismError('PEER_REJECTED', {
        reason: 'mismatched protocolVersion',
        peerId: peer.nodeId,
        expected: this.protocolVersion,
        received: peer.protocolVersion
      });
    }

    if (!peer.strictDeterminism) {
      throw new WnodeDeterminismError('PEER_REJECTED', {
        reason: 'unsafe determinism flags',
        peerId: peer.nodeId
      });
    }

    this.peers.set(peer.nodeId, peer);
  }

  public removePeer(nodeId: string): void {
    this.peers.delete(nodeId);
  }
}
