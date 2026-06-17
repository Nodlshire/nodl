import { BitsoIntegration } from './sdk';

async function runTests() {
    console.log('Testing Bitso Integration...');
    const integration = new BitsoIntegration('test_key', 'test_secret');
    console.log('Bitso Integration initialized.');
}
runTests();
