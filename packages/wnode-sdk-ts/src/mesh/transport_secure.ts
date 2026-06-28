import { Transport, TransportMessage } from './transport';
import { IntegrityProtectedMessage, MeshIntegrityValidator } from './integrity';
import { MeshByzantineMonitor, ByzantineIncidentType } from './byzantine';
import { MeshAuthRegistry } from './auth';
import { WnodeDeterminismError } from '../errors';

export interface SecureTransport extends Transport {
  send(message: IntegrityProtectedMessage): Promise<void>;
  broadcast(message: IntegrityProtectedMessage): Promise<void>;
  onMessage(topic: string, handler: (msg: IntegrityProtectedMessage) => void): void;
}

export class DeterministicSecureMemoryTransport implements SecureTransport {
  private peers: Set<string> = new Set();
  private subscribers: Map<string, Array<(msg: IntegrityProtectedMessage) => void>> = new Map();
  private sequence: number = 0;

  constructor(
    public readonly nodeId: string,
    private readonly integrityValidator: MeshIntegrityValidator,
    private readonly byzantineMonitor: MeshByzantineMonitor,
    private readonly authRegistry: MeshAuthRegistry
  ) {
    this.peers.add(nodeId);
  }

  async start(): Promise<void> {}
  async stop(): Promise<void> {
    this.subscribers.clear();
    this.peers.clear();
  }

  async publish(topic: string, payload: Uint8Array): Promise<void> {
    throw new Error('Use broadcast or send for SecureTransport');
  }

  subscribe(topic: string, handler: (msg: TransportMessage) => void): void {
    throw new Error('Use onMessage for SecureTransport');
  }

  unsubscribe(topic: string): void {
    this.subscribers.delete(topic);
  }

  getPeers(): string[] {
    return Array.from(this.peers);
  }

  async broadcast(message: IntegrityProtectedMessage): Promise<void> {
    this.sequence++;
    
    // In a real network, we'd serialize this. For in-memory, we pass it through directly.
    // Simulate network propagation to handlers
    const handlers = this.subscribers.get('mesh:secure:v1') || [];
    for (const handler of handlers) {
      // Receiver side validation logic
      this.simulateReceive(message, handler);
    }
  }

  async send(message: IntegrityProtectedMessage): Promise<void> {
    await this.broadcast(message);
  }

  onMessage(topic: string, handler: (msg: IntegrityProtectedMessage) => void): void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, []);
    }
    this.subscribers.get(topic)!.push(handler);
  }

  private simulateReceive(message: IntegrityProtectedMessage, handler: (msg: IntegrityProtectedMessage) => void): void {
    if (this.byzantineMonitor.isByzantine(message.senderNodeId)) {
      // Silently drop messages from quarantined nodes
      return;
    }

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
