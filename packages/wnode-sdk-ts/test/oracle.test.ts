import { WnodeClient } from '../src/client';
import { OracleClient } from '../src/oracle';
import { WnodeOracleError } from '../src/errors';

describe('OracleClient Cross-Validation', () => {
  let client: WnodeClient;
  let oracle: OracleClient;

  beforeEach(() => {
    client = new WnodeClient({
      endpoint: 'http://localhost',
      chainId: 1,
      sdkVersion: '1.0.0',
      apiVersion: '1.0',
      strictDeterminism: true,
    });
    oracle = new OracleClient(client);
  });

  it('should throw PRICE_MISMATCH if deviation exceeds threshold', async () => {
    // Mock the readContract to return different prices for primary and secondary
    jest.spyOn(client, 'readContract').mockImplementation(async (params: any) => {
      if (params.address === '0xPrimary') {
        return { answer: BigInt(100 * 1e8), updatedAt: Math.floor(Date.now() / 1000) };
      }
      if (params.address === '0xSecondary') {
        return { answer: BigInt(110 * 1e8), updatedAt: Math.floor(Date.now() / 1000) }; // 10% diff
      }
      return null;
    });

    await expect(oracle.getVerifiedPrice('0xPrimary', {
      secondaryFeedAddress: '0xSecondary',
      deviationThreshold: 0.05, // 5% threshold
    })).rejects.toThrow(WnodeOracleError);
  });

  it('should pass if deviation is within threshold', async () => {
    jest.spyOn(client, 'readContract').mockImplementation(async (params: any) => {
      if (params.address === '0xPrimary') {
        return { answer: BigInt(100 * 1e8), updatedAt: Math.floor(Date.now() / 1000) };
      }
      if (params.address === '0xSecondary') {
        return { answer: BigInt(101 * 1e8), updatedAt: Math.floor(Date.now() / 1000) }; // 1% diff
      }
      return null;
    });

    const data = await oracle.getVerifiedPrice('0xPrimary', {
      secondaryFeedAddress: '0xSecondary',
      deviationThreshold: 0.05,
    });

    expect(data.price).toBe(100);
  });
});
