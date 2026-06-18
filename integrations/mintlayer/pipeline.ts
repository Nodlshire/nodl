import { MintlayerSDK } from "./sdk";
import { wipeMintlayerState } from "./helpers";

export async function runMintlayerPipeline(payload: any) {
  const sdk = new MintlayerSDK("https://rpc.mintlayer.org");
  console.log("[Mintlayer Pipeline] Initializing ephemeral session...");
  
  // 1. Dispatch raw unsigned Mintlayer transaction payload
  const result = await sdk.executeContractCall(payload);
  
  // 2. Clear state immediately
  console.log("[Mintlayer Pipeline] Wiping memory state...");
  wipeMintlayerState(payload);
  
  return result;
}
