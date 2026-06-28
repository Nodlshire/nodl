import { MeshNode } from '../../src/mesh/node';
import { WnodeClient } from '../../src/client';
import { ByzantineIncidentType } from '../../src/mesh/byzantine';

describe('Mesh Network Layer Phase 1.7', () => {
  let nodeA: MeshNode;
  let nodeB: MeshNode;
  let nodeC: MeshNode;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      executeWorkflow: jest.fn().mockResolvedValue({
        proof: { version: '1.0', stepHashes: ['0xaaaa'], blockTag: { finalized: true } }
      })
    };

    nodeA = new MeshNode('nodeA', '1.0.0', mockClient as unknown as WnodeClient);
    nodeB = new MeshNode('nodeB', '1.0.0', mockClient as unknown as WnodeClient);
    nodeC = new MeshNode('nodeC', '1.0.0', mockClient as unknown as WnodeClient);
  });

  afterEach(async () => {
    await nodeA.stop();
    await nodeB.stop();
    await nodeC.stop();
  });

  test('Peer connection lifecycle and auth validation', async () => {
    // Connect B to A
    await nodeB.connection.connectToPeer('192.168.1.1', {
      nodeId: 'nodeA',
      authToken: 'auth-nodeA-mock',
      capabilities: []
    });

    expect(nodeB.connection.getConnectedNodeIds()).toContain('nodeA');
    expect(nodeB.auth.isTrusted('nodeA')).toBe(true);

    // Try to connect to a node with bad auth
    await nodeB.connection.connectToPeer('192.168.1.2', {
      nodeId: 'nodeC',
      authToken: 'invalid-auth',
      capabilities: []
    });

    expect(nodeB.connection.getConnectedNodeIds()).not.toContain('nodeC');
    expect(nodeB.auth.isTrusted('nodeC')).toBe(false);
    expect(nodeB.auth.isSuspicious('nodeC')).toBe(true);
  });

  test('Network transport messaging and deduplication', async () => {
    await nodeA.start();
    await nodeB.start();

    // Link transports for simulated QUIC
    nodeA.transport.onMessage('mesh:secure:v1', (msg) => {
      nodeB.transport.broadcast(msg);
    });

    await nodeB.connection.connectToPeer('192.168.1.1', {
      nodeId: 'nodeA',
      authToken: 'auth-nodeA-mock',
      capabilities: []
    });

    const assignment = {
      workflowId: 'wf-net-1',
      stepId: 'step-1',
      nodeId: 'nodeB',
      action: 'readContract',
      params: { address: '0xnet' },
      blockTag: '0x456'
    };

    await nodeA.broadcastAssignment(assignment);
    await new Promise(resolve => setTimeout(resolve, 50));

    const bAssignments = nodeB.coordinator.getAssignments();
    expect(bAssignments.length).toBe(1);

    // Resend to test deduplication
    await nodeA.broadcastAssignment(assignment);
    await new Promise(resolve => setTimeout(resolve, 50));

    const bAssignments2 = nodeB.coordinator.getAssignments();
    expect(bAssignments2.length).toBe(1); // Still 1
  });

  test('Byzantine quarantine across network boundaries', async () => {
    await nodeA.start();
    await nodeC.start();

    // nodeC is malicious
    await nodeA.connection.connectToPeer('192.168.1.3', {
      nodeId: 'nodeC',
      authToken: 'auth-nodeC-mock', // passes initial connect auth
      capabilities: []
    });

    const msg = nodeC.gossip.createMessage('nodeC', { wf: 'bad' });
    const secureMsg = nodeC.integrity.signMessage(msg, []);
    secureMsg.integrityProof = 'bad-mac'; // Tamper it

    // Send tampered message multiple times
    await nodeA.transport.broadcast(secureMsg);
    await nodeA.transport.broadcast(secureMsg);

    expect(nodeA.byzantine.isByzantine('nodeC')).toBe(true);
    expect(nodeA.getSecuritySnapshot().quarantinedNodes).toContain('nodeC');
  });
});
