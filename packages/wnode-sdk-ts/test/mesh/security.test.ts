import { MeshNode } from '../../src/mesh/node';
import { WnodeClient } from '../../src/client';
import { ByzantineIncidentType } from '../../src/mesh/byzantine';

describe('Mesh Security Phase 1.6', () => {
  let nodeA: MeshNode;
  let nodeB: MeshNode;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      executeWorkflow: jest.fn().mockResolvedValue({
        proof: { version: '1.0', stepHashes: ['0xaaaa'], blockTag: { finalized: true } }
      })
    };

    nodeA = new MeshNode('nodeA', '1.0.0', mockClient as unknown as WnodeClient);
    nodeB = new MeshNode('nodeB', '1.0.0', mockClient as unknown as WnodeClient);

    // Cross register for trust in auth registry
    nodeB.auth.registerNode({ nodeId: 'nodeA', authToken: 'auth-nodeA-mock', capabilities: [] });
    nodeA.auth.registerNode({ nodeId: 'nodeB', authToken: 'auth-nodeB-mock', capabilities: [] });
  });

  afterEach(async () => {
    await nodeA.stop();
    await nodeB.stop();
  });

  test('Node authentication and capability validation', () => {
    expect(nodeA.auth.isTrusted('nodeB')).toBe(true);
    expect(nodeA.auth.isTrusted('nodeC')).toBe(false);
  });

  test('Message integrity validation and tamper detection', async () => {
    await nodeA.start();
    await nodeB.start();

    // Link secure transports manually
    nodeA.transport.onMessage('mesh:secure:v1', (msg) => {
      nodeB.transport.broadcast(msg);
    });

    const assignment = {
      workflowId: 'wf-1',
      stepId: 'step-1',
      nodeId: 'nodeB',
      action: 'readContract',
      params: { address: '0x123' },
      blockTag: '0x456'
    };

    // Valid broadcast
    await nodeA.broadcastAssignment(assignment);
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(nodeB.coordinator.getAssignments().length).toBe(1);

    // Tampered broadcast (invalid payload hash)
    const msg = nodeA.gossip.createMessage('nodeA', assignment);
    const secureMsg = nodeA.integrity.signMessage(msg, []);
    secureMsg.payloadHash = 'tampered-hash';
    
    await nodeB.transport.broadcast(secureMsg); // Send directly to B
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Should trigger an incident for nodeA on nodeB
    const logs = nodeB.byzantine.getIncidentLog('nodeA');
    expect(logs.length).toBe(1);
    expect(logs[0].type).toBe(ByzantineIncidentType.INVALID_INTEGRITY_PROOF);
  });

  test('Byzantine detection heuristics and quarantine behavior', async () => {
    // Inject multiple invalid messages to cross the suspicion threshold (3)
    const msg = nodeA.gossip.createMessage('nodeA', { wf: 'wf' });
    const secureMsg = nodeA.integrity.signMessage(msg, []);
    secureMsg.integrityProof = 'invalid-proof';

    // 1st offense
    await nodeB.transport.broadcast(secureMsg);
    // 2nd offense (exceeds threshold of 3 since INVALID_INTEGRITY_PROOF is weight 2)
    await nodeB.transport.broadcast(secureMsg);

    const logs = nodeB.byzantine.getIncidentLog('nodeA');
    expect(logs.length).toBe(2);

    expect(nodeB.byzantine.isByzantine('nodeA')).toBe(true);
    expect(nodeB.auth.isSuspicious('nodeA')).toBe(true);
    expect(nodeB.auth.isTrusted('nodeA')).toBe(false);

    // Quarantine behavior: messages from nodeA should now be silently dropped
    const validMsg = nodeA.gossip.createMessage('nodeA', { wf: 'valid' });
    const secureValidMsg = nodeA.integrity.signMessage(validMsg, []);
    await nodeB.transport.broadcast(secureValidMsg);

    // Incident count shouldn't go up because it's dropped before validation
    const logsAfter = nodeB.byzantine.getIncidentLog('nodeA');
    expect(logsAfter.length).toBe(2);
  });

  test('Security snapshot reporting', async () => {
    // Record one minor incident to trigger "suspicious" state
    nodeA.byzantine.recordIncident('nodeB', ByzantineIncidentType.INVALID_PROOF_FRAGMENT, 'bad proof');

    const snapshot = nodeA.getSecuritySnapshot();
    expect(snapshot.suspiciousNodeCount).toBe(1);
    expect(snapshot.byzantineNodeCount).toBe(0);
    expect(snapshot.rejectedMessageCount).toBe(1);

    // Record another to cross quarantine threshold
    nodeA.byzantine.recordIncident('nodeB', ByzantineIncidentType.INCONSISTENT_STEP_CLAIM, 'bad claim');
    
    const snapshot2 = nodeA.getSecuritySnapshot();
    expect(snapshot2.suspiciousNodeCount).toBe(0); // It's now Byzantine, not just suspicious
    expect(snapshot2.byzantineNodeCount).toBe(1);
    expect(snapshot2.quarantinedNodes).toContain('nodeB');
  });
});
