import { IntegrationRegistry } from '../../src/integrations/registry';
import { EthereumAdapter } from '../../src/integrations/blockchain/ethereum';
import { FilecoinAdapter } from '../../src/integrations/storage/filecoin';

describe('Integration Registry Phase 2.0', () => {
  let registry: IntegrationRegistry;

  beforeEach(() => {
    registry = new IntegrationRegistry();
  });

  test('Deterministic registration and duplicate prevention', () => {
    const ethAdapter = new EthereumAdapter();
    registry.registerIntegration(ethAdapter);

    expect(() => registry.registerIntegration(ethAdapter)).toThrow(/already registered/);
  });

  test('Deterministic listing order', () => {
    registry.registerIntegration(new FilecoinAdapter());
    registry.registerIntegration(new EthereumAdapter());

    const list = registry.listIntegrations();
    // E before F
    expect(list[0].name).toBe('ethereum');
    expect(list[1].name).toBe('filecoin');
  });

  test('Capability validation', () => {
    registry.registerIntegration(new EthereumAdapter());
    
    // By default all generated adapters have all true
    expect(registry.validateIntegrationCapabilities('ethereum', { canFetch: true })).toBe(true);
  });
});
