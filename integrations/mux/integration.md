# MUX Protocol Integration Overview

## What is MUX Protocol?
MUX is a decentralized leveraged trading aggregator. It routes trades to the most optimal underlying perpetual protocol (e.g., GMX, Gains Network) or utilizes its own native liquidity pool (MUXLP) if it offers better pricing. It provides unified liquidity and deep leverage up to 100x.

## Why Wnode Integrates with MUX
Like all decentralized perpetual exchanges, MUX relies on a network of external **Keepers** to execute liquidations and process limit orders. Wnode integrates to provide scalable Keeper infrastructure for the MUX native pool.

## How Wnode Interacts with MUX
Wnode monitors the MUX `OrderBook` and `Liquidation` contracts across multiple chains (Arbitrum, Optimism, Avalanche). It tracks real-time Chainlink oracles to determine when a position's margin drops below maintenance requirements, triggering the `liquidatePosition` call.

## Example Agent Workflows
- **Perpetual Liquidation**: A trader is long ETH at 100x leverage on MUX. A sudden 1% drop in ETH price pushes their margin below the threshold. The Wnode agent immediately executes the liquidation transaction, seizing the remaining margin to protect the MUXLP pool.
- **MUXLP Yield Compounding**: Wnode automatically claims protocol fee rewards (ETH/ARB) for users holding MUXLP and restakes them into the pool.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Execution Bounties**:
1. **Liquidation Fees**: Keepers earn a direct percentage of the liquidated position's collateral or a flat execution fee plus gas reimbursement.
2. **Limit Order Bounties**: Capturing execution spreads for successfully settling take-profit and stop-loss orders.

## Activation Steps
1. Fund the Wnode execution wallet with native gas tokens on the target L2 networks.
2. Connect to high-throughput RPCs to minimize execution latency.
3. Set `ENABLE_MUX_KEEPER=true`.

## Limitations
- High latency sensitivity. The MUX Keeper network is competitive; if the Wnode RPC is slower than a competing MEV bot, the execution transaction will revert.

## Future Upgrade Path
- Arbitrage Execution: Automating basis trading by identifying funding rate discrepancies between the MUX native pool and external exchanges like Binance or Hyperliquid.
