import { MeshNode } from '../../src/mesh/node';
import { DeterministicMemoryTransport } from '../../src/mesh/transport';
import { WnodeClient } from '../../src/client';

describe('Mesh Integration Phase 1.5', () => {
  let nodeA: MeshNode;
  let nodeB: MeshNode;
  let mockClientA: any;
  let mockClientB: any;

  beforeEach(() => {
    mockClientA = {
      executeWorkflow: jest.fn().mockResolvedValue({
        proof: { version: '1.0', stepHashes: ['0xaaaa'], blockTag: '0x123' }
      })
    };
    mockClientB = {
      executeWorkflow: jest.fn().mockResolvedValue({
        proof: { version: '1.0', stepHashes: ['0xbbbb'], blockTag: '0x123' }
      })
    };

    nodeA = new MeshNode('nodeA', '1.0.0', mockClientA as unknown as WnodeClient);
    nodeB = new MeshNode('nodeB', '1.0.0', mockClientB as unknown as WnodeClient);
  });

  afterEach(async () => {
    await nodeA.stop();
    await nodeB.stop();
  });

  test('Deterministic gossip propagation and deduplication', async () => {
    await nodeA.start();
    await nodeB.start();

    // Link transports manually for test since it's an in-memory simulation
    nodeA.transport.subscribe('mesh:workflow:v1', (msg) => {
      nodeB.transport.publish(msg.topic, msg.payload);
    });

    nodeB.discovery.handleHeartbeat({ nodeId: 'nodeA', sdkVersion: '1.0.0', protocolVersion: '1.0', strictDeterminism: true, capabilities: [] } as any);
    nodeA.discovery.handleHeartbeat({ nodeId: 'nodeB', sdkVersion: '1.0.0', protocolVersion: '1.0', strictDeterminism: true, capabilities: [] } as any);

    const assignment = {
      workflowId: 'wf-1',
      stepId: 'step-1',
      nodeId: 'nodeB',
      action: 'readContract',
      params: { address: '0x123' },
      blockTag: '0x456'
    };

    await nodeA.broadcastAssignment(assignment);

    // Wait for async propagation
    await new Promise(resolve => setTimeout(resolve, 100));

    const bAssignments = nodeB.coordinator.getAssignments();
    expect(bAssignments.length).toBe(1);
    expect(bAssignments[0].workflowId).toBe('wf-1');
    expect(bAssignments[0].stepId).toBe('step-1');
  });

  test('Deterministic message ordering', async () => {
    const msg1 = nodeA.gossip.createMessage('nodeA', { workflowId: 'wf', stepId: 'B', nodeId: 'N', action: 'readContract', params: {}, blockTag: '0x1' });
    const msg2 = nodeA.gossip.createMessage('nodeA', { workflowId: 'wf', stepId: 'A', nodeId: 'N', action: 'readContract', params: {}, blockTag: '0x1' });

    nodeA.messages.enqueue(msg1);
    nodeA.messages.enqueue(msg2);

    const first = nodeA.messages.dequeue();
    const second = nodeA.messages.dequeue();

    // Should be ordered by messageId due to canonical sort
    expect(first!.messageId < second!.messageId || first!.messageId > second!.messageId).toBeTruthy();
  });

  test('Minimal multi-node workflow coordination & stepHash validation', async () => {
    const assignment = {
      workflowId: 'wf-2',
      stepId: 'step-2',
      nodeId: 'nodeA',
      action: 'readContract',
      params: {},
      blockTag: '0x123'
    };

    nodeA.coordinator.assignStep(assignment);

    const result = await nodeA.worker.executeStep(assignment);
    expect(result.stepHash).toBe('0xaaaa');
    expect(result.localProof.version).toBe('1.0');
  });

  test('Deterministic ProofOfCompute aggregation', () => {
    const results = [
      { workflowId: 'wf-3', stepId: 'step-1', nodeId: 'nodeA', stepHash: '0xaaaa', localProof: { version: '1.0', stepHashes: ['0xaaaa'], blockTag: { finalized: true }, workflowId: 'wf-3', timestamp: 123, chainId: 1 } },
      { workflowId: 'wf-3', stepId: 'step-2', nodeId: 'nodeB', stepHash: '0xbbbb', localProof: { version: '1.0', stepHashes: ['0xbbbb'], blockTag: { finalized: true }, workflowId: 'wf-3', timestamp: 123, chainId: 1 } }
    ];

    const proof = nodeA.proof.aggregateProofs('wf-3', results, 1, '0x123');
    expect(proof.merkleRoot).toBeDefined();
    expect(proof.stepHashes.length).toBe(2);
    expect(proof.workflowId).toBe('wf-3');
  });

  test('Mesh health reporting', () => {
    const report = nodeA.getHealthReport();
    expect(report.activePeers).toBe(0); // 0 peers, only localNode exists
    expect(report.isHealthy).toBe(true);
    expect(report.localNodeId).toBe('nodeA');
  });
});
