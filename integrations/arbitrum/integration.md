# Arbitrum Integration Overview

## What is Arbitrum?
Arbitrum (Nitro) is an Optimistic Rollup Layer 2 scaling solution for Ethereum. It bundles transactions off-chain and submits the state root to the Ethereum Mainnet, utilizing interactive fraud proofs to resolve disputes.

## Why Wnode Integrates with Arbitrum
Wnode integrates with Arbitrum to provide decentralized infrastructure for its rollup mechanics. By running Active Validator nodes, Wnode operators can secure the network, assert state, and participate in the BOLD (Bounded Liquidity Delay) dispute resolution protocol.

## How Wnode Interacts with Arbitrum
Wnode operators deploy the canonical Arbitrum Nitro node software. The integration monitors the L1 `RollupUserFacet` and `SequencerInbox` contracts to track state. Operators stake ETH on Ethereum Mainnet to create `RBlock` assertions or challenge malicious assertions.

## Example Agent Workflows
- **Fraud Proof Challenger**: Wnode monitors all posted assertions. If the local Nitro execution differs from a staked assertion, Wnode automatically initiates a challenge via the `challengeManager` contract.
- **RPC Provisioning**: Running an Archive node to sell high-throughput RPC access to Arbitrum-native dApps within the Wnode ecosystem.

## Revenue Model (Real Incentives)
Wnode operators generate revenue through **Validator Slashing Mechanics**:
1. **Honest Defense**: When challenging a malicious validator, the honest Wnode operator recovers a portion of the malicious actor's staked ETH (currently requiring substantial stakes, often up to 10k ETH depending on network config) if the interactive fraud proof is won.
2. **Future Sequencer Fees**: As sequencing decentralizes, operators will earn a cut of L2 transaction fees.

## Activation Steps
1. Sync an Ethereum L1 full node (required for Arbitrum base state).
2. Sync the Arbitrum Nitro binary.
3. Configure Wnode with the validator's L1 staking keys and enable `ENABLE_ARBITRUM_VALIDATOR=true`.

## Limitations
- Requires massive local storage (multi-terabyte NVMe) for Nitro archive state.
- Capital intensive: Active validation requires locking significant ETH on the L1 rollup contract.

## Future Upgrade Path
- Native integration with Arbitrum Stylus (WASM/Rust smart contracts) to allow Wnode automation scripts to be deployed directly to the L2.
