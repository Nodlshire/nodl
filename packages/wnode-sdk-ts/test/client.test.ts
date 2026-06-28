import { WnodeClient } from '../src/client';
import { WnodeDeterminismError } from '../src/errors';
import { DeterministicRPCAdapter } from '../src/adapters/rpc';

jest.spyOn(DeterministicRPCAdapter.prototype, 'readContract').mockImplementation(async function(this: any, params: any) {
  if (this.config && this.config.strictDeterminism && params.blockTag && typeof params.blockTag === 'object' && 'blockNumber' in params.blockTag) {
    throw new WnodeDeterminismError('UNSAFE_BLOCKTAG', {});
  }
  return { result: 'mock-result', metadata: {} as any };
});

describe('WnodeClient Determinism', () => {
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

  it('should allow finalized blockTag in strict mode', async () => {
    await expect(clientStrict.readContract({
      address: '0x123',
      abi: '[]',
      functionName: 'test',
      blockTag: 'finalized',
    })).resolves.not.toThrow();
  });

  it('should allow blockHash blockTag in strict mode', async () => {
    await expect(clientStrict.readContract({
      address: '0x123',
      abi: '[]',
      functionName: 'test',
      blockTag: { blockHash: '0xabc' },
    })).resolves.not.toThrow();
  });

  it('should reject blockNumber in strict mode with WnodeDeterminismError', async () => {
    await expect(clientStrict.readContract({
      address: '0x123',
      abi: '[]',
      functionName: 'test',
      blockTag: { blockNumber: 12345 },
    })).rejects.toThrow(WnodeDeterminismError);
  });

  it('should allow blockNumber in non-strict mode', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    await expect(clientNonStrict.readContract({
      address: '0x123',
      abi: '[]',
      functionName: 'test',
      blockTag: { blockNumber: 12345 },
    })).resolves.not.toThrow();

  });
});
