import { getRelayHealth } from "./activation_sdk";

export async function checkStatus() {
  const flashbotsHealthUrl = "https://relay.flashbots.net"; // Flashbots root
  
  const fbStatus = await getRelayHealth(flashbotsHealthUrl);
  console.log("Flashbots Relay Status:", fbStatus ? "ONLINE" : "OFFLINE");
  return fbStatus;
}
