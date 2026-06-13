# Lyra Finance Integration Overview

## What is Lyra Finance?
Lyra is a decentralized options protocol natively deployed on Layer 2s (Arbitrum, Optimism). It utilizes a sophisticated Automated Market Maker (AMM) that prices options using the Black-Scholes model, allowing users to buy and sell calls and puts against a pooled liquidity contract.

## Why Wnode Integrates with Lyra
Options contracts have strict expiration times and collateral requirements. Wnode integrates with Lyra to provide decentralized **Options Settlement and Liquidation** infrastructure, earning bounties for keeping the protocol mathematically sound.

## How Wnode Interacts with Lyra
Wnode interfaces with the `OptionMarket`, `OptionToken`, and `LiquidityPool` contracts. It actively tracks the expiration timestamps of minted option series and monitors the collateral levels of traders who short (sell) options to the AMM.

## Example Agent Workflows
- **Option Settlement**: When an option series expires (e.g., Friday 08:00 UTC), it must be mathematically settled against the current oracle price. Wnode automatically calls `settleOptions` for all in-the-money contracts.
- **Short Liquidation**: Wnode tracks users who have sold options. If the underlying asset price moves sharply and the user's collateral ratio drops below the maintenance margin, Wnode executes `liquidatePosition`.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Keeper Bounties & Liquidation Fees**:
1. **Settlement Bounties**: The Lyra protocol pays a flat fee (in stablecoins) + gas refunds to Keepers who successfully call settlement functions on expired boards.
2. **Liquidation Penalties**: Liquidating undercollateralized short positions yields a percentage of the user's collateral as a reward for securing the AMM's solvency.

## Activation Steps
1. Configure a low-latency RPC for Arbitrum/Optimism.
2. Set `ENABLE_LYRA_OPTIONS_KEEPER=true`.
3. Ensure Wnode's execution wallet is funded with ETH for gas.

## Limitations
- Option settlement on Lyra relies on specific oracle snapshots. If the RPC latency causes the agent to miss the snapshot execution window, another Keeper will claim the bounty.

## Future Upgrade Path
- Delta Hedging Automation: Building a module that interacts with Lyra's internal GMX/Synthetix delta-hedging logic to automatically maintain delta-neutral positions for large LPs.
