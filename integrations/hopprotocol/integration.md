# Hop Protocol Integration Overview

## What is Hop Protocol?
Hop Protocol is a scalable rollup-to-rollup general token bridge. It allows users to send tokens instantly across Layer 2s and Ethereum Mainnet by utilizing AMMs on each chain to swap "hTokens" (Hop's bridge tokens) to native assets.

## Why Wnode Integrates with Hop
Hop requires a decentralized network of **Bonders** to provide upfront liquidity on destination chains. Bonders front-run the slow, canonical cross-chain messaging layers, allowing users to receive funds instantly.

## How Wnode Interacts with Hop
Wnode operates Hop Bonder nodes. The agent listens to the `TransferSent` events on the origin chain (e.g., Optimism), verifies the transaction validity, and immediately calls `bondTransferRoot` or `bondWithdrawal` on the destination chain (e.g., Arbitrum), providing its own liquidity.

## Example Agent Workflows
- **Cross-Chain Bonding**: A user sends 1000 USDC from Arbitrum to Optimism. The canonical message takes 7 days (optimistic rollup delay). The Wnode Bonder detects the transfer, instantly mints 1000 USDC to the user on Optimism, and later claims the canonical 1000 USDC when the 7-day delay clears.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Bonder Fees**:
1. **Bridge Spread**: Users pay a small fee (e.g., 0.05% - 0.2%) for instant liquidity. The Bonder captures this fee as profit for taking on the brief liquidity lockup and finality risk.

## Activation Steps
1. Lock collateral (e.g., USDC, ETH) in the Hop Bonder contracts on all supported chains.
2. Deploy the Wnode Bonder container, connected to RPCs for Ethereum, Arbitrum, Optimism, Base, and Polygon.
3. Set `ENABLE_HOP_BONDER=true`.

## Limitations
- Highly capital intensive: Wnode must maintain massive liquid inventory on multiple destination chains to process large bridge volumes.
- Rebalancing liquidity between chains incurs base layer bridge fees.

## Future Upgrade Path
- Automated AMM Rebalancing: Building agents to execute arbitrage across the Hop AMMs on different L2s to maintain deep liquidity and collect LP fees.
