import { DeterministicQUICTransport } from './transport_quic';
import { MeshConnectionManager } from './connection';
import { MeshDiscovery } from './discovery';
import { MeshGossipLayer } from './gossip';
import { MessageQueue } from './messages';
import { MeshWorkflowCoordinator, MeshWorkflowWorker } from './workflow';
import { MeshProofAggregator } from './proof';
import { MeshHealthMonitor, MeshHealthReport, SecuritySnapshot } from './health';
import { MeshAuthRegistry } from './auth';
import { MeshIntegrityValidator, IntegrityProtectedMessage } from './integrity';
import { MeshByzantineMonitor } from './byzantine';
import { IntegrationRegistry } from '../integrations/registry';
import { WnodeClient } from '../client';
import { GossipMessage, PeerInfo, WorkflowStepAssignment } from './types';
import { WnodeDeterminismError } from '../errors';

export class MeshNode {
  public transport: DeterministicQUICTransport;
  public connection: MeshConnectionManager;
  public auth: MeshAuthRegistry;
  public integrity: MeshIntegrityValidator;
  public byzantine: MeshByzantineMonitor;
  public discovery: MeshDiscovery;
  public gossip: MeshGossipLayer;
  public messages: MessageQueue;
  public coordinator: MeshWorkflowCoordinator;
  public worker: MeshWorkflowWorker;
  public proof: MeshProofAggregator;
  public health: MeshHealthMonitor;
  public integrations: IntegrationRegistry;

  private readonly topic = 'mesh:secure:v1';

  constructor(
    public readonly localNodeId: string,
    public readonly sdkVersion: string,
    public readonly client: WnodeClient
  ) {
    this.auth = new MeshAuthRegistry();
    this.byzantine = new MeshByzantineMonitor(this.auth);
    this.integrity = new MeshIntegrityValidator(this.auth);
    this.transport = new DeterministicQUICTransport(localNodeId, this.integrity, this.byzantine, this.auth);
    this.connection = new MeshConnectionManager(this.transport, this.auth, this.byzantine);
    
    this.discovery = new MeshDiscovery(localNodeId, sdkVersion, '1.0');
    this.gossip = new MeshGossipLayer();
    this.messages = new MessageQueue();
    this.coordinator = new MeshWorkflowCoordinator();
    this.integrations = new IntegrationRegistry();
    this.worker = new MeshWorkflowWorker(client, localNodeId, this.integrations);
    this.proof = new MeshProofAggregator();
    this.health = new MeshHealthMonitor(this.discovery, this.byzantine, this.integrations);

    // Self-register in auth registry for simulation
    this.auth.registerNode({
      nodeId: localNodeId,
      authToken: `auth-${localNodeId}-mock`,
      capabilities: ['canExecuteWorkflow', 'canAggregateProofs', 'canGossip']
    });

    // Initialize local peer info in discovery
    this.discovery.handleHeartbeat({
      nodeId: localNodeId,
      sdkVersion,
      protocolVersion: '1.0',
      strictDeterminism: true,
      capabilities: []
    } as PeerInfo);
  }

  public async start(): Promise<void> {
    await this.transport.start();
    
    // Subscribe to gossip topic via secure onMessage
    this.transport.onMessage(this.topic, (msg) => {
      this.handleIncomingSecureGossip(msg);
    });
  }

  public async stop(): Promise<void> {
    await this.transport.stop();
  }

  public async broadcastAssignment(assignment: WorkflowStepAssignment): Promise<void> {
    const validated = MessageQueue.validateStepAssignment(assignment);
    const msg = this.gossip.createMessage(this.localNodeId, validated);
    
    const secureMsg = this.integrity.signMessage(msg, this.auth.getNodeCapabilities(this.localNodeId));
    
    // Publish to secure transport
    await this.transport.broadcast(secureMsg);
  }

  private handleIncomingSecureGossip(msg: IntegrityProtectedMessage): void {
    try {
      
      const knownPeers = [
        { nodeId: this.localNodeId, sdkVersion: this.sdkVersion, protocolVersion: '1.0', strictDeterminism: true, capabilities: [] } as PeerInfo,
        ...this.connection.getConnectedNodeIds().map(id => ({ nodeId: id, sdkVersion: '1.0', protocolVersion: '1.0', strictDeterminism: true, capabilities: [] }))
      ];

      this.gossip.processIncomingMessage(msg, knownPeers);
      this.messages.enqueue(msg);

      this.processMessages();
    } catch (err) {
      if (err instanceof WnodeDeterminismError) {
        // Log deterministic rejection
        console.error(`[Determinism Error]`, err);
      } else {
        console.error(`[Mesh Node Error] Failed to handle incoming gossip:`, err);
      }
    }
  }

  private processMessages(): void {
    let msg = this.messages.dequeue();
    while (msg) {
      const assignment = msg.payload as WorkflowStepAssignment;
      try {
        const validated = MessageQueue.validateStepAssignment(assignment);
        this.coordinator.assignStep(validated);
        
        // If assigned to us, we could execute it automatically, 
        // but typically a worker loop polls the coordinator.
      } catch (err) {
         // Silently drop invalid assignments from message queue processing
      }
      msg = this.messages.dequeue();
    }
  }

  public getHealthReport(): MeshHealthReport {
    return this.health.generateReport();
  }

  public getSecuritySnapshot(): SecuritySnapshot {
    return this.health.getSecuritySnapshot();
  }
}
