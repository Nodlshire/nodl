import { MeshNode } from '../../src/mesh/node';
import { WnodeClient } from '../../src/client';
import { EthereumAdapter } from '../../src/integrations/blockchain/ethereum';

describe('Integration Workflow Extension Phase 2.0', () => {
  let nodeA: MeshNode;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      executeWorkflow: jest.fn().mockResolvedValue({
        proof: { version: '1.0', stepHashes: ['0xaaaa'], blockTag: { finalized: true } }
      })
    };

    nodeA = new MeshNode('nodeA', '1.0.0', mockClient as unknown as WnodeClient);
    nodeA.integrations.registerIntegration(new EthereumAdapter());
  });

  afterEach(async () => {
    await nodeA.stop();
  });

  test('Workflow resolves and executes integration deterministically', async () => {
    const assignment = {
      workflowId: 'wf-int-1',
      stepId: 'step-1',
      nodeId: 'nodeA',
      action: 'readIntegration',
      params: { query: '0x123' },
      blockTag: 'latest',
      integrationName: 'ethereum',
      integrationOperation: 'fetch' as const
    };

    nodeA.coordinator.assignStep(assignment);

    const result = await nodeA.worker.executeStep(assignment);
    
    expect(typeof result.integrationPayloadHash).toBe('string');
    expect(typeof result.integrationIntegrityProof).toBe('string');
  });
  
  test('MeshHealthMonitor exposes integration snapshot', () => {
    const snapshot = nodeA.getHealthReport();
    // integration snapshot is on nodeA.health
    const intSnapshot = nodeA.health.getIntegrationSnapshot();
    
    expect(intSnapshot.registeredCount).toBe(1);
    expect(intSnapshot.integrations[0].name).toBe('ethereum');
  });
});
