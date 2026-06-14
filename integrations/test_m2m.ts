import { checkStatus } from './m2m/activation_status';
async function run() {
  console.log("--- M2M TEST ---");
  const status = await checkStatus();
  console.log("Status Check:", status ? "PASS" : "FAIL");
}
run();
