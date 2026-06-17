import { BaseIntegration } from './sdk';

async function runTests() {
    console.log('Testing Base Integration...');
    const integration = new BaseIntegration('https://mainnet.base.org');
    console.log('Base Integration initialized.');
}
runTests();
