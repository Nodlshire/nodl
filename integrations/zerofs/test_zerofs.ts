import { ZeroFSIntegration } from './sdk';

async function runTests() {
    console.log('Testing ZeroFS Integration...');
    const integration = new ZeroFSIntegration('/mnt/zerofs/ephemeral');
    console.log('ZeroFS Integration initialized.');
}
runTests();
