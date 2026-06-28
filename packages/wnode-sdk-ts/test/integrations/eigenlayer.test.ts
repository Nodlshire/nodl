import { EigenlayerAdapter } from '../../src/integrations/blockchain/eigenlayer';

describe('EIGENLAYER Integration Adapter', () => {
  let adapter: EigenlayerAdapter;

  beforeEach(() => {
    adapter = new EigenlayerAdapter();
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
