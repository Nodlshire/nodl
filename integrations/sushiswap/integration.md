# SushiSwap Integration Overview

## What is SushiSwap?
SushiSwap is a decentralized exchange (DEX) and DeFi ecosystem featuring AMM pools, concentrated liquidity (SushiSwap V3), lending/margin trading (Kashi/BentoBox), and cross-chain swaps (SushiXSwap).

## Why Wnode Integrates with SushiSwap
Wnode integrates with SushiSwap to provide execution layers for limit orders and to automate liquidity management, capturing fees and optimizing yields for users across the expansive BentoBox ecosystem.

## How Wnode Interacts with SushiSwap
Wnode interacts with the `LimitOrder` and `BentoBox` contracts. The agent monitors off-chain order books and on-chain price feeds. When a limit order becomes actionable, Wnode executes the swap.

## Example Agent Workflows
- **Limit Order Execution**: Wnode monitors signed EIP-712 limit orders. When the target price is hit on the AMM, Wnode calls `execute()` on the limit order contract, processing the trade for the user.
- **Kashi Liquidations**: Monitoring undercollateralized margin positions in Kashi lending markets and executing liquidations.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Execution Fees & Liquidations**:
1. **Limit Order Bounties**: Users attach a gas fee bounty to their limit orders. Keepers (Wnode) pocket the spread between the bounty and the actual execution gas cost.
2. **Kashi Liquidation Penalties**: Liquidators receive a discount on seized collateral, instantly arbitraged for a net profit.

## Activation Steps
1. Configure RPC connections to networks where Sushi holds high volume (Arbitrum, Polygon, Ethereum).
2. Set `ENABLE_SUSHI_KEEPER=true` to begin scanning limit orders.

## Limitations
- High competition for limit order execution.
- Kashi markets have lower liquidity compared to Aave/Maker, meaning liquidation opportunities may be smaller and require careful slippage control.

## Future Upgrade Path
- Integrating SushiXSwap via Stargate/LayerZero to automate cross-chain arbitrage across different Sushi deployments.
