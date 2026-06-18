import { runFireblocksPipeline } from "./pipeline";
import { formatFireblocksPayload } from "./helpers";

async function testFireblocks() {
  console.log("Starting Fireblocks integration test...");
  const payload = formatFireblocksPayload({ assetId: "USDC", amount: 100 });
  const result = await runFireblocksPipeline(payload);
  
  if (result.status !== "success") {
    throw new Error("Fireblocks Pipeline Test Failed");
  }
  
  console.log("Fireblocks Pipeline Test Passed.");
}

testFireblocks().catch(console.error);
