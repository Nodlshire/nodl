export interface TransportMessage {
  id: string;
  senderId: string;
  topic: string;
  payload: Uint8Array;
  sequenceNumber: number;
  timestamp: number;
}

export interface Transport {
  start(): Promise<void>;
  stop(): Promise<void>;
  publish(topic: string, payload: Uint8Array): Promise<void>;
  subscribe(topic: string, handler: (msg: TransportMessage) => void): void;
  unsubscribe(topic: string): void;
  getPeers(): string[];
}

/**
 * Deterministic in-memory transport for Phase 1.5 testing and local mesh simulation.
 * Ensures consistent ordering of messages and predictable peer discovery.
 */
export class DeterministicMemoryTransport implements Transport {
  private peers: Set<string> = new Set();
  private subscribers: Map<string, Array<(msg: TransportMessage) => void>> = new Map();
  private sequence: number = 0;
  
  constructor(public readonly nodeId: string) {
    this.peers.add(nodeId);
  }

  async start(): Promise<void> {
    // Initialization logic for memory transport
  }

  async stop(): Promise<void> {
    this.subscribers.clear();
    this.peers.clear();
  }

  async publish(topic: string, payload: Uint8Array): Promise<void> {
    this.sequence++;
    const message: TransportMessage = {
      id: `${this.nodeId}-${this.sequence}`,
      senderId: this.nodeId,
      topic,
      payload,
      sequenceNumber: this.sequence,
      timestamp: Date.now(),
    };

    const handlers = this.subscribers.get(topic) || [];
    // In a deterministic simulation, we process synchronously or via a fixed event loop
    for (const handler of handlers) {
      handler(message);
    }
  }

  subscribe(topic: string, handler: (msg: TransportMessage) => void): void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, []);
    }
    this.subscribers.get(topic)!.push(handler);
  }

  unsubscribe(topic: string): void {
    this.subscribers.delete(topic);
  }

  getPeers(): string[] {
    return Array.from(this.peers);
  }
}
