import { RippleIntegration } from './sdk';

async function runTests() {
    console.log('Testing Ripple Integration...');
    const integration = new RippleIntegration('wss://s.altnet.rippletest.net:51233', 'sEd...');
    console.log('Ripple Integration initialized.');
}
runTests();
