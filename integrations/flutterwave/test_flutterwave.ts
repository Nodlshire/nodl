import { FlutterwaveIntegration } from './sdk';

async function runTests() {
    console.log('Testing Flutterwave Integration...');
    const integration = new FlutterwaveIntegration('FLWSECK_TEST-sandbox');
    console.log('Flutterwave Integration initialized.');
}
runTests();
