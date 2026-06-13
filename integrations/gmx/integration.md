# GMX (V1 & V2) Integration Overview

## What is GMX?
GMX is a decentralized spot and perpetual exchange on Arbitrum and Avalanche. While V1 uses the GLP pool, **V2** utilizes isolated GM pools, Auto-Deleveraging (ADL), price-impact models, and requires low-latency Chainlink DataStreams for execution.

## Why Wnode Integrates with GMX
Both V1 and V2 require a decentralized network of **Keepers** to execute limit orders, stop-losses, and liquidations. V2 introduces a highly complex execution paradigm requiring Keepers to bundle off-chain oracle payloads with the on-chain execution transaction.

## How Wnode Interacts with GMX
For V2, Wnode listens to the `OrderVault` and monitors the Chainlink DataStreams API. When a user's limit order price is met, Wnode pulls the signed oracle price report from the DataStream API and passes it as a payload directly into the `executeOrder` or `executeLiquidation` contract call.

## Example Agent Workflows
- **V2 DataStream Execution**: A user places a take-profit order at $4,000 ETH. Wnode monitors the off-chain Chainlink DataStream. Once ETH hits $4,000, Wnode automatically bundles the signed Chainlink payload and calls `executeOrder`, settling the trade instantly.
- **Auto-Deleveraging (ADL)**: If a GM pool becomes dangerously imbalanced, Wnode Keepers trigger the ADL function to protect LPs from protocol insolvency.

## Revenue Model (Real Incentives)
Wnode operators generate revenue via **Keeper Execution Bounties**:
1. **V2 Execution Fees**: Users pre-pay an execution fee in native tokens (ETH/AVAX). The Wnode Keeper executing the transaction receives this entire fee, yielding a net profit equal to the Execution Fee minus the L2 Gas Cost.

## Activation Steps
1. Register the Wnode operator address with GMX Governance (whitelisting required for V1/V2 Keepers).
2. Configure an Arbitrum/Avalanche RPC and a Chainlink DataStreams API key.
3. Set `ENABLE_GMX_V2_KEEPER=true`.

## Limitations
- Requires whitelisting by the GMX DAO to be a recognized execution Keeper.
- Requires ultra-low latency RPC infrastructure to beat competing Keepers to the execution block.
- **DataStream Latency**: If the off-chain oracle payload expires or is front-run by a faster Keeper, the execution transaction will revert, costing Wnode base layer gas.

## Future Upgrade Path
- **GM Pool Delta-Hedging**: Automatically minting GM tokens and simultaneously opening short positions on Binance/Hyperliquid to create delta-neutral, high-yield funding rate strategies.
