import { IpfsAdapter } from '../../src/integrations/storage/ipfs';

describe('IPFS Integration Adapter', () => {
  let adapter: IpfsAdapter;

  beforeEach(() => {
    adapter = new IpfsAdapter();
  });

  test('deterministic fetch', async () => {
    const res = await adapter.fetch({ query: 'test' });
    expect(res.payloadHash).toBeTruthy();
    expect(res.integrityProof).toBeTruthy();
    expect(res.errorCode).toBeUndefined();
  });

  test('deterministic error on bad fetch', async () => {
    const res = await adapter.fetch({});
    expect(res.errorCode).toBe('INVALID_PARAMS');
  });

  test('deterministic submit', async () => {
    const res = await adapter.submit({ payload: 'data' });
    expect(res.result).toBeDefined();
    expect(res.payloadHash).toBeTruthy();
  });

  test('deterministic validate', async () => {
    const res = await adapter.validate({ hash: '0xabc' });
    expect(res.ok).toBe(true);
    expect(res.payloadHash).toBeTruthy();
  });
});
