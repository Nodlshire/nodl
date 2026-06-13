# Maverick Protocol Integration Overview

## What is Maverick Protocol?
Maverick Protocol is a Dynamic Distribution Automated Market Maker (AMM). It allows Liquidity Providers (LPs) to deploy capital using active strategies (Mode Right, Mode Left, Mode Both) where the AMM automatically shifts their liquidity bins to follow the price of the asset, drastically increasing capital efficiency.

## Why Wnode Integrates with Maverick
While Maverick automatically moves liquidity bins, it does not auto-compound LP fees or optimize Boosted Positions. Wnode integrates to provide the external automation layer required to maximize MAV emissions and re-center liquidity when price shocks break the AMM's automated bounds.

## How Wnode Interacts with Maverick
Wnode interfaces with the `MaverickPool` and `MaverickReward` contracts. The agent tracks the active bins of a user's LP position. If the market price breaches the extreme edges of the liquidity distribution, Wnode automatically calls `removeLiquidity`, calculates a new optimal bin distribution, and calls `addLiquidity`.

## Example Agent Workflows
- **Extreme Price Re-Centering**: An LP provides liquidity to a wstETH/ETH pool in "Mode Both". If a sudden de-peg event pushes the price outside the active bins entirely, the capital goes dormant. Wnode detects this, withdraws the assets, and redeploys them centered around the new broken peg to continue earning fees.
- **Boosted Position Harvesting**: Wnode continuously harvests MAV tokens from Boosted Positions and auto-swaps them into the underlying LP pair.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Dynamic LP Optimization Fees**:
1. **High-Efficiency Trading Fees**: Due to Maverick's design, LPs capture significantly more volume. Wnode takes a performance fee on the generated yield.
2. **MAV Farming**: Extracting MAV inflation rewards from targeted liquidity provision.

## Activation Steps
1. Define the LP risk parameters and directional bias (Left/Right/Both) in the Wnode config.
2. Approve the Maverick `Router` for automated deposits.
3. Set `ENABLE_MAVERICK_ALM=true`.

## Limitations
- Dynamic AMMs inherently increase Impermanent Loss if the asset price mean-reverts sharply after the AMM has already shifted the liquidity bins. This requires the Wnode agent to accurately forecast volatility using off-chain metrics.

## Future Upgrade Path
- Native integration with Maverick V2 (which introduces programmable pool logic) to deploy custom Wnode smart contracts that execute JIT (Just-in-Time) liquidity provisioning right before large DEX aggregator trades occur.
