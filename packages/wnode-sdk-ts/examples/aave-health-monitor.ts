import { WnodeClient, OracleClient, WnodeError } from '../src';

async function main() {
  const client = new WnodeClient({
    endpoint: 'http://localhost:8545',
    chainId: 1,
    sdkVersion: '1.0.0',
    apiVersion: '1.0',
    strictDeterminism: true,
  });

  const oracle = new OracleClient(client);

  const ethUsdPrimary = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'; // Chainlink ETH/USD
  const ethUsdSecondary = '0x0000000000000000000000000000000000000000'; // Mock Secondary

  try {
    console.log('Fetching deterministically cross-validated price...');
    const priceData = await oracle.getVerifiedPrice(ethUsdPrimary, {
      maxStaleness: 3600, // 1 hour
      secondaryFeedAddress: ethUsdSecondary,
      deviationThreshold: 0.02, // 2%
    });

    console.log('Verified Price Data:', priceData);

    const healthFactorParams = {
      userAddress: '0x123...',
      ethPrice: priceData.price,
    };

    console.log('Executing Aave health factor workflow deterministically...');
    const result = await client.executeWorkflow({
      workflow: 'aave-health-monitor-v1',
      params: healthFactorParams,
    });

    console.log('Workflow Result:', result.result);
    console.log('Proof of Compute:', result.proof);

    // Audit the run
    await client.auditLog({
      event: 'HealthFactorMonitored',
      proof: result.proof,
    });

  } catch (error) {
    if (error instanceof WnodeError) {
      console.error(`[${error.code}] ${error.message}`);
      if (error.code === 'PRICE_MISMATCH') {
        console.error('Triggering fallback logic due to oracle deviation...');
      }
    } else {
      console.error(error);
    }
  }
}

main();
