import { BluefinIntegration } from './sdk';

async function runTests() {
    console.log('Testing Bluefin Integration...');
    // Mock private key for testing
    const integration = new BluefinIntegration('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
    console.log('Integration initialized.');
}
runTests();
