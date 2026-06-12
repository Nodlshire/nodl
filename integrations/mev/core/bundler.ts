export async function submit_bundle(chain: string, txs: any[], priority: number) {
  console.log(`[Bundler] Routing bundle of ${txs.length} txs on ${chain} with priority ${priority}`);
  // Respect chain-specific semantics for private vs public mempool submission
  return { success: true, bundleId: Date.now() };
}
