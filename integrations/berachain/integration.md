# Berachain Integration Overview

## What is Berachain?
Berachain is a high-performance, EVM-compatible Layer 1 blockchain utilizing a novel consensus mechanism called **Proof-of-Liquidity (PoL)**. Unlike Proof-of-Stake where validators only stake a single token to secure the network, PoL rewards users for providing liquidity to the ecosystem.

## Why Wnode Integrates with Berachain
Berachain fundamentally shifts validator economics. Validators earn block rewards, but they also direct BGT (Bera Governance Token) emissions to specific dApps. Wnode integrates to run Validator Nodes and participate in the highly lucrative PoL bribery marketplace.

## How Wnode Interacts with Berachain
Wnode deploys the CometBFT/EVM consensus client to run a Berachain Validator. It interacts with the BEX (native DEX), Bend (native lending), and Berps (native perpetuals) to automate liquidity provision and harvest BGT emissions.

## Example Agent Workflows
- **PoL Validator & Bribery**: Wnode runs a Berachain Validator. DeFi protocols (e.g., a new DEX) want more liquidity, so they bribe Wnode with their native tokens. Wnode accepts the bribe and programs its validator node to direct its BGT token emissions block-rewards to the bribing protocol's liquidity pool.
- **Automated BGT Harvesting**: Users deposit liquidity into Wnode managed vaults. Wnode algorithms route the liquidity to the highest BGT-yielding pools across the network, automatically claiming and wrapping the non-transferable BGT into liquid wBGT for instant realization.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Validator Operations & Yield Management**:
1. **Validator Block Rewards**: Native gas fees and BERA block rewards for securing the network.
2. **Bribery Revenue**: Direct revenue extracted from third-party protocols paying to acquire the validator's BGT emission influence.

## Activation Steps
1. Provision the Berachain execution and consensus containers.
2. Stake the required BERA to activate the validator node.
3. Set `ENABLE_BERA_VALIDATOR=true`.

## Limitations
- BGT is mathematically non-transferable and can only be burned for BERA or used for governance. Monetizing BGT relies entirely on efficient wrapping mechanisms or accepting third-party bribes.

## Future Upgrade Path
- Native integration with specialized Berachain bribe markets (like Redacted Cartel) to fully automate the bidding and acceptance of validator PoL votes.
