import { runMintlayerPipeline } from "./pipeline";
import { formatMintlayerPayload } from "./helpers";

async function testMintlayer() {
  console.log("Starting Mintlayer integration test...");
  const payload = formatMintlayerPayload({ contract: "swap" });
  const result = await runMintlayerPipeline(payload);
  
  if (result.status !== "success") {
    throw new Error("Mintlayer Pipeline Test Failed");
  }
  
  console.log("Mintlayer Pipeline Test Passed.");
}

testMintlayer().catch(console.error);
