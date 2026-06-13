# Drift Protocol Integration Overview

## What is Drift Protocol?
Drift Protocol is a decentralized perpetual swap exchange on the Solana blockchain. It utilizes a dynamic virtual AMM (vAMM) combined with a Decentralized Limit Order Book (DLOB) and Just-In-Time (JIT) liquidity to provide deep, low-slippage trading.

## Why Wnode Integrates with Drift
Drift relies on an external network of **Keeper Bots** to crank its DLOB, execute liquidations, and provide JIT liquidity. Wnode integrates with Drift to run these Keepers on high-performance Solana nodes, capturing execution bounties.

## How Wnode Interacts with Drift
Wnode deploys the official Drift Keeper TypeScript SDK. Connected to a low-latency Solana RPC, Wnode scans the DLOB for crossing limit orders, triggered stop-losses, or undercollateralized margin accounts, instantly submitting Solana instructions to settle them.

## Example Agent Workflows
- **DLOB Cranking**: Wnode continuously matches taker orders against the Decentralized Limit Order Book. When an order is filled, Wnode signs the execution transaction, routing the trade and collecting a fee.
- **JIT Liquidity Provision**: Wnode temporarily acts as a market maker for incoming large trades, stepping in to take the other side of a trade for 5 seconds before the vAMM steps in, capturing the maker fee.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Solana Keeper Bounties**:
1. **Execution Fees**: Drift pays Keepers a percentage of the taker fee (in USDC) for successfully cranking limit/stop orders.
2. **Liquidation Spreads**: Executing liquidations on underwater Drift margin accounts yields a percentage of the liquidated collateral.

## Activation Steps
1. Provision a high-performance, low-latency Solana RPC node (or connect to a premium provider like Helius/Triton).
2. Fund a Solana Keypair with SOL (for gas) and USDC (for JIT liquidity).
3. Set `ENABLE_DRIFT_KEEPER=true`.

## Limitations
- Extreme network competition. Solana Keepers operate in a highly saturated environment. Wnode must utilize Jito MEV bundles to guarantee transaction inclusion and avoid failed execution gas costs.

## Future Upgrade Path
- Native integration with the Drift Insurance Fund staking modules to automate the compounding of protocol revenue directly into Wnode treasuries.
