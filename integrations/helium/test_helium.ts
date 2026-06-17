import { HeliumIntegration } from './sdk';

async function runTests() {
    console.log('Testing Helium Integration...');
    const integration = new HeliumIntegration('https://api.mainnet-beta.solana.com', 'test-api-key');
    console.log('Helium Integration initialized.');
}
runTests();
