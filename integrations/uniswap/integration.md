# Uniswap Integration Overview

## What is Uniswap?
Uniswap is the largest decentralized exchange (DEX) protocol on Ethereum. Uniswap V3 introduced Concentrated Liquidity, allowing LPs to bound their capital within specific price ticks. Uniswap V4 introduces "Hooks" for custom liquidity pool execution logic.

## Why Wnode Integrates with Uniswap
Concentrated liquidity requires active management. If an asset's price moves outside a user's defined tick range, their capital goes dormant and earns zero fees. Wnode integrates with Uniswap to provide Automated Liquidity Management (ALM) for node operators and end-users.

## How Wnode Interacts with Uniswap
Wnode utilizes the `NonfungiblePositionManager` contract. The agent monitors the active pool price via the V3 `slot0` state. If the price breaches the bounds, Wnode calls `decreaseLiquidity`, swaps assets to rebalance, and calls `mint` to establish a new position around the current price.

## Example Agent Workflows
- **Auto-Rebalancing LP**: An operator sets a +/- 5% range for a WETH/USDC position. Wnode monitors the pool and automatically readjusts the ticks when volatility pushes the price near the boundary.
- **Fee Harvesting**: Automatically executing the `collect()` function to harvest accrued trading fees and auto-compounding them back into the active liquidity position.

## Revenue Model (Real Incentives)
Wnode generates revenue through **Yield Optimization**:
1. **LP Trading Fees**: Actively managed capital earns the standard pool fee tier (0.01%, 0.05%, 0.3%, or 1.0%) on all trades crossing the active ticks.
2. **Management Fees**: Wnode can collect a performance fee (e.g., 2% of yield) from users utilizing its ALM infrastructure.

## Activation Steps
1. Configure valid RPCs and approval limits for the `NonfungiblePositionManager`.
2. Define the LP rebalancing strategy bounds in the Wnode config.
3. Set `ENABLE_UNISWAP_ALM=true`.

## Limitations
- **Impermanent Loss**: Auto-rebalancing realizes impermanent loss dynamically. Severe volatility can drain capital faster than fee accrual.
- **Gas Costs**: Rebalancing requires multiple complex contract calls (`decreaseLiquidity`, `exactInputSingle`, `mint`). On L1, this is only profitable for large capital positions.

## Future Upgrade Path
- **Uniswap V4 Hooks**: Deploying custom Wnode-managed Hooks to execute Just-In-Time (JIT) liquidity provisioning.
