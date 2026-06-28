import { WnodeClient, WnodeDeterminismError } from '../src';

async function main() {
  const client = new WnodeClient({
    endpoint: 'http://localhost:8545',
    chainId: 1,
    sdkVersion: '1.0.0',
    apiVersion: '1.0',
    strictDeterminism: true, // MUST be true for production
  });

  const ERC20_ABI = ['function totalSupply() external view returns (uint256)'];
  const tokenAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC

  try {
    console.log('Attempting deterministic read with finalized blockTag...');
    const result1 = await client.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'totalSupply',
      blockTag: 'finalized', // Safe
    });
    console.log('Success (finalized)! Result:', result1);

    console.log('Attempting deterministic read with explicit blockHash...');
    const result2 = await client.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'totalSupply',
      blockTag: { blockHash: '0xabc123...' }, // Safe
    });
    console.log('Success (blockHash)! Result:', result2);

    console.log('Attempting unsafe read with blockNumber...');
    const result3 = await client.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'totalSupply',
      blockTag: { blockNumber: 15000000 }, // UNSAFE in strict mode
    });
    console.log('Success?', result3);

  } catch (error) {
    if (error instanceof WnodeDeterminismError && error.code === 'UNSAFE_BLOCKTAG') {
      console.error('\n[EXPECTED ERROR] WnodeDeterminismError caught!');
      console.error('Strict mode successfully rejected the unsafe blockNumber read.');
      console.error('Error Context:', error.context);
    } else {
      console.error(error);
    }
  }
}

main();
