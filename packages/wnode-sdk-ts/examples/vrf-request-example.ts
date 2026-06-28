import { WnodeClient, VRFClient } from '../src';

async function main() {
  const client = new WnodeClient({
    endpoint: 'http://localhost:8545',
    chainId: 1,
    sdkVersion: '1.0.0',
    apiVersion: '1.0',
    strictDeterminism: true, // Strict mode enabled
  });

  const vrf = new VRFClient(client);

  const requestParams = {
    vrfCoordinator: '0x271682DEB8C4E0901D1a1550aD2e64D568E69909',
    keyHash: '0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef',
    subscriptionId: 1234,
    requestConfirmations: 3,
    callbackGasLimit: 100000,
    numWords: 1,
  };

  try {
    console.log('Generating pure calldata for VRF request...');
    const calldata = await vrf.generateVRFRequest(requestParams);
    console.log('Calldata generated:', calldata);

    console.log('Simulating fulfillment deterministically...');
    const simulation = await vrf.simulateFulfillment({
      request: requestParams,
      blockTag: 'finalized', // Using finalized block tag
    });
    
    console.log('Simulation Output:', simulation.simulatedOutput);
    console.log('Proof of Compute:', simulation.proof);
  } catch (error) {
    console.error(error);
  }
}

main();
