# Curve Finance (V2 & crvUSD) Integration Overview

## What is Curve?
Curve is a dominant Automated Market Maker (AMM) that features StableSwap (V1), CryptoSwap (V2), and **crvUSD**. The crvUSD stablecoin utilizes LLAMMA (Lending-Liquidating AMM Algorithm) to perform "soft-liquidations", dynamically converting collateral into stablecoins as prices drop, and back to collateral if prices recover.

## Why Wnode Integrates with Curve
Wnode integrates with Curve to manage complex liquidity positions, particularly in volatile V2 pools. Managing V2 liquidity requires active tracking of dynamic fees and EMA-based repegging to avoid impermanent loss, presenting massive opportunities for algorithmic management.

## How Wnode Interacts with Curve
Wnode monitors the `CurveV2Pool` for EMA tracking and interacts heavily with the `LLAMMA` and `PegKeeper` contracts for crvUSD. The agent executes arbitrage trades against the LLAMMA AMM bands to facilitate soft-liquidations.

## Example Agent Workflows
- **LLAMMA Arbitrage**: When the price of ETH drops, a user's crvUSD collateral enters "soft-liquidation" mode. Wnode detects that the LLAMMA AMM band is offering ETH at a slight discount. Wnode automatically buys the discounted ETH, securing the crvUSD peg and capturing a risk-free arbitrage spread.
- **PegKeeper Cranking**: Wnode calls the crvUSD PegKeeper contract when crvUSD deviates from $1.00, minting or burning crvUSD and claiming the caller bounty.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Arbitrage and Keeper Bounties**:
1. **LP Trading Fees & CRV**: Capturing dynamic fees (which spike during high volatility in V2 pools) and CRV emissions.
2. **LLAMMA Spreads**: Extracting direct profit from the price discrepancies within the crvUSD soft-liquidation bands.

## Activation Steps
1. Configure Ethereum RPC providers.
2. Define the risk thresholds (volatility limits) for the TriCrypto agent in the Wnode config.
3. Set `ENABLE_CURVE_V2_ALM=true`.

## Limitations
- Curve's mathematical models (LLAMMA and V2 polynomials) are exceptionally heavy to simulate fully off-chain. Wnode relies on highly optimized Rust-based models synced via the node RPC to calculate accurate profitability matrices.

## Future Upgrade Path
- **Hard Liquidations**: Executing full "hard-liquidations" for users whose collateral price completely falls through all configured LLAMMA bands without recovering.
