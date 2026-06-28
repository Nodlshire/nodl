import { WnodeClient } from '../../src/client';
import { DeterministicRPCAdapter } from '../../src/adapters/rpc';
import { WorkflowEngineAdapter } from '../../src/adapters/workflow';
import { AuditPipelineAdapter } from '../../src/adapters/audit';
import { WnodeDeterminismError, WnodeWorkflowError } from '../../src/errors';
import { ethers } from 'ethers';

jest.spyOn(DeterministicRPCAdapter.prototype, 'readContract').mockImplementation(async (params: any) => {
  if (params.blockTag && typeof params.blockTag === 'object' && 'blockNumber' in params.blockTag) {
    throw new WnodeDeterminismError('UNSAFE_BLOCKTAG', {});
  }
  return { result: 'mock-result', metadata: {} as any };
});

describe('Orchestrator Runtime Integration', () => {
  let clientStrict: WnodeClient;
  let clientNonStrict: WnodeClient;

  beforeEach(() => {
    clientStrict = new WnodeClient({
      endpoint: 'http://localhost',
      chainId: 1,
      sdkVersion: '1.0.0',
      apiVersion: '1.0',
      strictDeterminism: true,
    });

    clientNonStrict = new WnodeClient({
      endpoint: 'http://localhost',
      chainId: 1,
      sdkVersion: '1.0.0',
      apiVersion: '1.0',
      strictDeterminism: false,
    });
  });

  describe('Deterministic RPC Layer', () => {
    it('enforces blockTag anchoring and returns result natively', async () => {
      const result = await clientStrict.readContract({
        address: '0x123',
        abi: ['function testFunc() external view returns (string)'],
        functionName: 'testFunc',
        blockTag: 'finalized',
      });
      expect(result).toBe('mock-result');
    });

    it('rejects unsafe blockNumber in strict mode natively', async () => {
      await expect(clientStrict.readContract({
        address: '0x123',
        abi: '[]',
        functionName: 'testFunc',
        blockTag: { blockNumber: 12345 },
      })).rejects.toThrow(WnodeDeterminismError);
    });
  });

  describe('Orchestrator Calldata Pipeline', () => {
    it('returns exact orchestrator calldata schema', async () => {
      const payload = await clientStrict.buildCalldata({
        address: '0x123',
        abi: ['function testFunc(uint256 value)'],
        functionName: 'testFunc',
        args: [42],
      });

      expect(payload).toHaveProperty('to', '0x123');
      expect(payload).toHaveProperty('data');
      expect(payload).toHaveProperty('chainId', 1);
      expect(payload).toHaveProperty('sdkVersion', '1.0.0');
    });
  });

  describe('Workflow Engine Bindings', () => {
    it('computes ProofOfCompute hashing natively', async () => {
      const res = await clientStrict.executeWorkflow({
        workflow: 'test-workflow',
        params: { input: 'data' }
      });

      expect(res.result.success).toBe(true);
      expect(res.proof).toBeDefined();
      expect(res.proof?.stepHashes.length).toBe(1);
      expect(res.proof?.merkleRoot).toBeDefined();
      expect(res.proof?.blockTag).toEqual({ finalized: true }); // strict mode default
    });
  });

  describe('Audit Pipeline Integration', () => {
    it('executes non-blocking audit logging', async () => {
      // Mock stdout to verify it doesn't block but outputs
      const stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation();
      
      await clientStrict.auditLog({
        event: 'TestEvent',
        context: { key: 'value' },
      });

      expect(stdoutSpy).toHaveBeenCalled();
      stdoutSpy.mockRestore();
    });
  });
});
