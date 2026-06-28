import { WnodeClient } from '../src/client';
import { VRFClient } from '../src/vrf';

describe('VRFClient Simulation', () => {
  let client: WnodeClient;
  let vrf: VRFClient;

  beforeEach(() => {
    client = new WnodeClient({
      endpoint: 'http://localhost',
      chainId: 1,
      sdkVersion: '1.0.0',
      apiVersion: '1.0',
    });
    vrf = new VRFClient(client);
  });

  it('should simulate fulfillment and return proof', async () => {
    const result = await vrf.simulateFulfillment({
      request: {
        vrfCoordinator: '0x123',
        keyHash: '0xabc',
        subscriptionId: 1,
        requestConfirmations: 3,
        callbackGasLimit: 100000,
        numWords: 1,
      },
      blockTag: 'finalized',
    });

    expect(result.simulatedOutput).toBeDefined();
    expect(result.simulatedOutput.to).toBe('0x123');
    expect(result.proof).toBeDefined();
    expect(result.proof.version).toBe('1.0');
    expect(result.proof?.blockTag).toEqual({ finalized: true });
  });
});
