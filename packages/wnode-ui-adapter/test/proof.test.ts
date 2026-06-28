import { UIProofAdapter } from '../src/adapters/UIProofAdapter';

describe('UIProofAdapter', () => {
  let adapter: UIProofAdapter;

  beforeEach(() => {
    adapter = new UIProofAdapter();
  });

  it('validates and parses a correct proof', () => {
    const rawProof = {
      version: '1.0',
      workflowId: 'test-wf',
      stepHashes: ['0x1', '0x2'],
      merkleRoot: '0xroot',
      timestamp: 123456,
      chainId: 1,
      blockTag: { finalized: true },
    };

    const res = adapter.parseProof(rawProof);
    expect(res.ok).toBe(true);
    expect(res.data).toEqual(rawProof);
  });

  it('returns error on missing step hashes', () => {
    const rawProof = {
      version: '1.0',
      workflowId: 'test-wf',
    };

    const res = adapter.parseProof(rawProof);
    expect(res.ok).toBe(false);
    expect(res.error?.message).toBe('Proof is missing step hashes.');
  });

  it('returns error on unsupported version', () => {
    const rawProof = {
      version: '2.0',
      stepHashes: ['0x1'],
    };

    const res = adapter.parseProof(rawProof);
    expect(res.ok).toBe(false);
    expect(res.error?.message).toBe('Unsupported Proof of Compute version.');
  });
});
