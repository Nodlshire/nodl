import { MeshProofAggregator } from '../../src/mesh/proof';
import { WnodeDeterminismError } from '../../src/errors';
import { WorkflowStepResult } from '../../src/mesh/types';

describe('MeshProofAggregator', () => {
  let aggregator: MeshProofAggregator;

  beforeEach(() => {
    aggregator = new MeshProofAggregator();
  });

  it('aggregates valid step proofs deterministically', () => {
    const results: WorkflowStepResult[] = [
      {
        workflowId: 'wf-1',
        stepId: 'step-2', // test sorting
        nodeId: 'node-2',
        stepHash: '0x2222',
        localProof: {
          version: '1.0',
          workflowId: 'wf-1',
          stepHashes: ['0x2222'],
          timestamp: 1000,
          chainId: 1,
          blockTag: { finalized: true }
        }
      },
      {
        workflowId: 'wf-1',
        stepId: 'step-1',
        nodeId: 'node-1',
        stepHash: '0x1111',
        localProof: {
          version: '1.0',
          workflowId: 'wf-1',
          stepHashes: ['0x1111'],
          timestamp: 1000,
          chainId: 1,
          blockTag: { finalized: true }
        }
      }
    ];

    const proof = aggregator.aggregateProofs('wf-1', results, 1, { finalized: true });
    expect(proof.version).toBe('1.0');
    expect(proof.workflowId).toBe('wf-1');
    expect(proof.stepHashes.length).toBe(2);
    // Should be sorted by stepId: step-1, then step-2 -> '0x1111', '0x2222'
    expect(proof.stepHashes[0]).toBe('0x1111');
    expect(proof.stepHashes[1]).toBe('0x2222');
    expect(proof.merkleRoot).toBeDefined();
  });

  it('rejects mismatching workflow IDs', () => {
    const results: WorkflowStepResult[] = [
      {
        workflowId: 'wf-2',
        stepId: 'step-1',
        nodeId: 'node-1',
        stepHash: '0x1111',
        localProof: {
          version: '1.0',
          workflowId: 'wf-2',
          stepHashes: ['0x1111'],
          timestamp: 1000,
          chainId: 1,
          blockTag: { finalized: true }
        }
      }
    ];

    expect(() => aggregator.aggregateProofs('wf-1', results, 1, { finalized: true })).toThrow(WnodeDeterminismError);
  });
});
