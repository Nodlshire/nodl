# Manta Pacific Integration Overview

## What is Manta Pacific?
Manta Pacific is a scalable Layer 2 utilizing the Polygon Chain Development Kit (CDK) and Celestia for Data Availability (DA). Similar to Blast, it features native yield via yield-bearing tokens like STONE (Liquid Staked ETH) and wUSDM (yield-bearing stablecoin). It also features universal ZK-circuits.

## Why Wnode Integrates with Manta Pacific
Wnode integrates to provide low-cost EVM automation across the Manta ecosystem, utilizing the native yield-bearing assets to power algorithmic trading and DeFi liquidity provision with maximum capital efficiency.

## How Wnode Interacts with Manta Pacific
Wnode connects via standard EVM JSON-RPC to the Manta network. It automates interactions with Manta-native DEXes (like Aperture Finance) and lending protocols (like LayerBank).

## Example Agent Workflows
- **STONE/ETH Arbitrage**: Because STONE is a yield-bearing derivative, it can occasionally de-peg on secondary Manta DEXes. Wnode monitors the Manta DEX pools and automatically executes arbitrage swaps to re-peg STONE to its NAV, capturing the spread.

## Revenue Model (Real Incentives)
Wnode generates revenue via **L2 Arbitrage and Yield Management**:
1. **Peg Arbitrage**: Capturing direct ETH profit by maintaining the parity of STONE and wUSDM on secondary DEXes.
2. **Performance Fees**: Compounding native yield and protocol points across Manta dApps for user accounts.

## Activation Steps
1. Configure the Manta Pacific RPC.
2. Bridge target assets (ETH/USDC) to Manta to mint STONE/wUSDM.
3. Set `ENABLE_MANTA_ARBITRAGE=true`.

## Limitations
- Bridging assets off Manta back to Ethereum Mainnet requires navigating varying bridge delays depending on the state of the underlying zkEVM/Optimistic architecture during Manta's transition phases.

## Future Upgrade Path
- Integration with Manta's universal ZK-circuits to allow Wnode agents to submit private, zero-knowledge verifiable actions (like private KYC validation) directly on-chain.
