# Frax Finance (v3) Integration Overview

## What is Frax Finance?
Frax Finance (v3) is a fully collateralized stablecoin ecosystem that utilizes Algorithmic Market Operations (AMOs) to maintain the FRAX peg. V3 introduces sFRAX (backed by US Treasuries) and Fraxlend, a decentralized lending market.

## Why Wnode Integrates with Frax
Wnode integrates with Frax to act as a decentralized execution layer for AMOs and to capture highly profitable liquidation bounties on the isolated Fraxlend money markets.

## How Wnode Interacts with Frax
Wnode monitors the Fraxlend `Pair` contracts for underwater borrowers. Additionally, Wnode tracks the FRAX peg and calls the public AMO `rebalance` functions when the peg deviates from $1.00.

## Example Agent Workflows
- **Fraxlend Liquidator**: An agent monitors an isolated Fraxlend pair (e.g., CRV/FRAX). When the CRV price drops and the borrower's LTV exceeds the threshold, Wnode executes `liquidate`, repaying FRAX and seizing CRV at a discount.
- **AMO Peg Keeper**: Wnode detects FRAX trading at $0.998. It automatically calls the Collateral Investor AMO to pull USDC from Aave and uses it to buy FRAX on the open market, restoring the peg and claiming the caller bounty.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Liquidations and Bounties**:
1. **Liquidation Spreads**: Capturing the standard 10% liquidation penalty on Fraxlend.
2. **Keeper Bounties**: Earning gas refunds and micro-bounties for cranking AMO contracts.

## Activation Steps
1. Approve target Fraxlend Pair contracts in the Wnode configuration.
2. Set `ENABLE_FRAX_LIQUIDATOR=true`.

## Limitations
- Isolated Fraxlend pools can suffer from low liquidity on DEXes, making it difficult to swap seized collateral without high slippage during flash liquidations.

## Future Upgrade Path
- **Fraxchain L2 Validation**: Running validator and sequencer nodes directly on Fraxchain to secure the L2 and capture native block sequencing revenue.
