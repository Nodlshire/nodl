# Base Integration Overview

## What is Base?
Base is a secure, low-cost, Ethereum Layer 2 incubated by Coinbase and built on the open-source OP Stack. It operates as an Optimistic Rollup utilizing fault proofs (pessimistic proofs) to secure the network while providing massive retail distribution and native fiat/USDC on-ramps.

## Why Wnode Integrates with Base
Base has immense retail volume and liquidity, particularly on its dominant native DEX, Aerodrome Finance. The sheer volume of retail trading creates constant market inefficiencies, making Base highly lucrative for MEV and automated market making bots.

## How Wnode Interacts with Base
Wnode interfaces via high-speed EVM RPC nodes directly to the Base sequencer. Agents interact heavily with `AerodromeRouter` contracts and Aave V3 Base markets to execute swaps and liquidations.

## Example Agent Workflows
- **Aerodrome Arbitrage**: Retail volume frequently causes massive price dislocations in smaller meme-coin/USDC pools on Aerodrome. Wnode continuously monitors the mempool. When a dislocation occurs, Wnode uses flashbots/builder bundles to execute a back-run arbitrage, rebalancing the pool and extracting the spread.
- **Base Liquidations**: Monitoring Aave V3 lending markets on Base to execute flash-liquidations when retail leveraged positions become undercollateralized.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Arbitrage and MEV**:
1. **DEX Spreads**: Direct extraction of ETH from inefficient pricing across Aerodrome and other Base DEXes like Uniswap V3.
2. **Liquidation Bounties**: Claiming standard protocol liquidation penalties from Aave Base markets.

## Activation Steps
1. Configure a low-latency Base RPC (latency is critical due to the sequencer's block time).
2. Fund the execution wallet with ETH on Base.
3. Set `ENABLE_BASE_ARBITRAGE=true`.

## Limitations
- The Base L2 utilizes a centralized sequencer (currently managed by Coinbase). Standard public mempool MEV tactics (like front-running) are not possible. Wnode must rely strictly on atomic back-running and spatial arbitrage (DEX to DEX).

## Future Upgrade Path
- Integration with Coinbase's native Smart Wallet (Account Abstraction) APIs to allow Wnode operators to sponsor transactions for users onboarding directly from the centralized exchange.
