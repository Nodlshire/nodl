export async function with_flash_liquidity(amount: number, asset: string, chain: string, callback: Function) {
  console.log(`[Liquidity] Selecting best flash-liquidity source for ${amount} ${asset} on ${chain}`);
  // Execute callback atomically with borrowed funds
  const result = await callback();
  if (!result.success) {
    throw new Error("Flash liquidity execution failed. Reverting transaction.");
  }
  return result;
}
