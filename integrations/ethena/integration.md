# Ethena Integration Overview

## What is Ethena?
Ethena is a synthetic dollar protocol built on Ethereum that provides a crypto-native solution for money not reliant on traditional banking infrastructure. It issues USDe, a delta-neutral stablecoin fully backed by ETH/LST collateral and an equivalent short perpetual position on centralized or decentralized exchanges, capturing funding rates as yield.

## Why Wnode Integrates with Ethena
Ethena's staked USDe (sUSDe) offers some of the highest risk-adjusted yields in DeFi. Furthermore, the USDe peg is maintained through arbitrage. Wnode integrates to automate peg arbitrage and deeply leverage sUSDe yields using automated looping strategies.

## How Wnode Interacts with Ethena
Wnode interfaces with the Ethena `Minter` contract and secondary DEX pools (e.g., Curve USDe/USDC). It monitors the real-time peg of USDe. When USDe de-pegs, Wnode executes arbitrage loops, minting or redeeming via Ethena directly and trading on secondary markets.

## Example Agent Workflows
- **Automated Peg Arbitrage**: If USDe trades at $0.99 on Curve, Wnode automatically buys USDe from the pool and redeems it at the Ethena `Minter` contract for exactly $1.00 of ETH/stETH, pocketing the 1% risk-free spread.
- **Delta-Neutral Looping**: Wnode automates the process of depositing sUSDe into lending protocols (like Morpho), borrowing stablecoins against it, and buying more sUSDe to hyper-leverage the Ethena Shard (points) accumulation.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Arbitrage and Auto-Farming**:
1. **Peg Arbitrage Spreads**: Direct extraction of ETH/stablecoin profit from maintaining the USDe market peg.
2. **Yield Loop Fees**: Wnode takes a performance fee on the automated execution of highly leveraged sUSDe/Morpho points farming strategies.

## Activation Steps
1. Configure a primary Ethereum RPC.
2. Ensure Wnode wallets are KYC-whitelisted with Ethena (if utilizing direct Mint/Redeem contracts) or rely strictly on secondary DEX arbitrage.
3. Set `ENABLE_ETHENA_ARBITRAGE=true`.

## Limitations
- Direct Mint/Redeem access on Ethena is permissioned and subject to KYC. Permissionless arbitrage relies solely on secondary market AMMs.

## Future Upgrade Path
- Integrating direct API connections with Binance/Bybit to allow Wnode operators to deploy their own localized, scaled-down delta-hedging algorithms mirroring Ethena's core engine.
