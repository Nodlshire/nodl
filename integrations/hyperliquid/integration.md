# Hyperliquid Integration Overview

## What is Hyperliquid?
Hyperliquid is an L1 appchain purpose-built for high-frequency, fully on-chain orderbook perpetuals. Utilizing a custom Tendermint-based BFT consensus, it offers sub-second finality and zero gas fees for trading, matching the performance of centralized exchanges (CEXs) in a decentralized environment.

## Why Wnode Integrates with Hyperliquid
Hyperliquid's zero-gas, high-speed orderbook makes it the premier venue for decentralized High-Frequency Trading (HFT) and algorithmic market making. Wnode provides the low-latency hardware execution environment required to compete on the Hyperliquid L1.

## How Wnode Interacts with Hyperliquid
Unlike standard EVM smart contracts, Wnode interacts with Hyperliquid via its highly optimized native WebSockets and REST APIs, signing L1 actions with custom localized wallets.

## Example Agent Workflows
- **Algorithmic Market Making (AMM)**: Wnode continuously posts bid and ask limit orders around the mid-price of highly volatile assets (e.g., WIF, PEPE) on Hyperliquid, capturing the bid-ask spread and zeroing out delta exposure instantly.
- **Funding Rate Arbitrage**: Wnode monitors funding rates across Binance and Hyperliquid. It automatically opens a long on Hyperliquid and a short on Binance (or vice versa) to capture the funding rate delta with zero directional risk.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Market Making and Arbitrage**:
1. **Bid-Ask Spread**: Direct profit from HFT market making on the orderbook.
2. **Funding Rate Capture**: Guaranteed yields from maintaining delta-neutral basis trades.

## Activation Steps
1. Generate a Hyperliquid L1 API wallet and fund it with USDC via the Arbitrum bridge.
2. Deploy the Wnode Hyperliquid HFT container, ideally hosted in geographic proximity to the primary Hyperliquid validator nodes (Tokyo).
3. Set `ENABLE_HYPERLIQUID_HFT=true`.

## Limitations
- The Hyperliquid execution environment is entirely off-EVM. Wnode agents must rely on proprietary API signatures rather than standard ethers.js contract calls.

## Future Upgrade Path
- Running a full validator node for the Hyperliquid L1 (once permissionless validation is fully activated) to earn consensus rewards and secure the appchain.
