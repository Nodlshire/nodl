import { SecureTransport } from './transport_secure';
import { IntegrityProtectedMessage, MeshIntegrityValidator } from './integrity';
import { MeshByzantineMonitor, ByzantineIncidentType } from './byzantine';
import { MeshAuthRegistry } from './auth';
import { WnodeDeterminismError } from '../errors';

export interface NetworkSecureTransport extends SecureTransport {
  connect(peerAddress: string): Promise<void>;
  disconnect(peerAddress: string): Promise<void>;
  sendTo(peerAddress: string, message: IntegrityProtectedMessage): Promise<void>;
  getConnectedPeers(): string[];
}

export class DeterministicQUICTransport implements NetworkSecureTransport {
  private peers: Set<string> = new Set();
  private subscribers: Map<string, Array<(msg: IntegrityProtectedMessage) => void>> = new Map();
  private sequence: number = 0;

  constructor(
    public readonly nodeId: string,
    private readonly integrityValidator: MeshIntegrityValidator,
    private readonly byzantineMonitor: MeshByzantineMonitor,
    private readonly authRegistry: MeshAuthRegistry
  ) {}

  async start(): Promise<void> {}
  async stop(): Promise<void> {
    this.subscribers.clear();
    this.peers.clear();
  }

  async connect(peerAddress: string): Promise<void> {
    this.peers.add(peerAddress);
  }

  async disconnect(peerAddress: string): Promise<void> {
    this.peers.delete(peerAddress);
  }

  async sendTo(peerAddress: string, message: IntegrityProtectedMessage): Promise<void> {
    if (!this.peers.has(peerAddress)) {
      throw new Error(`Cannot send to unconnected peer: ${peerAddress}`);
    }
    // Simulate framing & network dispatch
    await this.simulateNetworkDelivery(message);
  }

  async broadcast(message: IntegrityProtectedMessage): Promise<void> {
    this.sequence++;
    // Simulate QUIC broadcast/multicast logic
    await this.simulateNetworkDelivery(message);
  }

  async send(message: IntegrityProtectedMessage): Promise<void> {
    await this.broadcast(message);
  }

  getConnectedPeers(): string[] {
    return Array.from(this.peers);
  }

  getPeers(): string[] {
    return this.getConnectedPeers();
  }

  onMessage(topic: string, handler: (msg: IntegrityProtectedMessage) => void): void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, []);
    }
    this.subscribers.get(topic)!.push(handler);
  }

  // Obsolete standard transport interfaces:
  async publish(topic: string, payload: Uint8Array): Promise<void> {
    throw new Error('Use broadcast or sendTo for NetworkSecureTransport');
  }
  subscribe(topic: string, handler: any): void {
    throw new Error('Use onMessage for NetworkSecureTransport');
  }
  unsubscribe(topic: string): void {
    this.subscribers.delete(topic);
  }

  private async simulateNetworkDelivery(message: IntegrityProtectedMessage): Promise<void> {
    const handlers = this.subscribers.get('mesh:secure:v1') || [];
    for (const handler of handlers) {
      if (this.byzantineMonitor.isByzantine(message.senderNodeId)) return;
      try {
        this.integrityValidator.validateMessage(message);
        handler(message);
      } catch (err) {
        if (err instanceof WnodeDeterminismError) {
          this.byzantineMonitor.recordIncident(
            message.senderNodeId,
            ByzantineIncidentType.INVALID_INTEGRITY_PROOF,
            err.message
          );
        }
      }
    }
  }
}
