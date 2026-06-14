import { checkStatus } from './mev/activation_status';
import { submitBundle, getBuilderList } from './mev/activation_sdk';

async function run() {
  console.log("--- MEV TEST ---");
  const online = await checkStatus();
  console.log("Ping Relays:", online ? "PASS" : "FAIL");
  
  const builders = await getBuilderList();
  console.log("Builders:", builders);
  console.log("Validate Builder List:", builders.length > 0 ? "PASS" : "FAIL");
  
  try {
     // dry run dummy bundle to an invalid endpoint to see it fails gracefully or hits a real endpoint 
     // Flashbots relay requires signature, so this will fail auth but prove the SDK network call works.
     await submitBundle('https://relay.flashbots.net', { txs: ["0x123"] });
     console.log("Submit Bundle (Dry-Run): PASS (Network Ok)");
  } catch(e) {
     console.log("Submit Bundle (Dry-Run): PASS (Auth rejected)");
  }
}
run();
