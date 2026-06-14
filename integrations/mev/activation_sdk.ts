export async function getRelayHealth(relayUrl: string): Promise<boolean> {
  try {
    const res = await fetch(relayUrl);
    return res.ok || res.status === 200 || res.status === 400; // Some endpoints return 400 for bad ping paths but are online
  } catch (error) {
    return false;
  }
}

export async function getBuilderList(): Promise<string[]> {
  return [
    "builder0x69",
    "beaverbuild.org",
    "rsync-builder.xyz",
    "Titan Builder"
  ];
}

export function selectBestBuilder(criteria: { network: string }): string {
  if (criteria.network === "Ethereum Mainnet") return "beaverbuild.org";
  return "builder0x69";
}

export async function submitBundle(relayUrl: string, bundle: any): Promise<any> {
  const res = await fetch(relayUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_sendBundle",
      params: [bundle]
    })
  });
  return res.json();
}
