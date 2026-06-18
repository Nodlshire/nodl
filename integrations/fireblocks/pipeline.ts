import { FireblocksSDK } from "./sdk";
import { wipeFireblocksState } from "./helpers";

export async function runFireblocksPipeline(payload: any) {
  const sdk = new FireblocksSDK("ephemeral_api_key", "ephemeral_private_key");
  console.log("[Fireblocks Pipeline] Initializing ephemeral session...");
  
  // 1. Dispatch transaction intent
  const result = await sdk.createTransaction(payload);
  
  // 2. Clear state immediately
  console.log("[Fireblocks Pipeline] Wiping memory state...");
  wipeFireblocksState(payload);
  
  return result;
}
