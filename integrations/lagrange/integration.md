# Lagrange State Committees Integration Overview

## What is Lagrange?
Lagrange is an interoperability protocol that generates Zero-Knowledge (ZK) proofs of blockchain state. The **Lagrange State Committees (LSC)** operate as an Actively Validated Service (AVS) on EigenLayer, providing fast, cryptographically secure attestations of optimistic rollup block headers (e.g., Arbitrum, Optimism).

## Why Wnode Integrates with Lagrange
By integrating with Lagrange, Wnode operators can monetize their restaked ETH by participating in a cutting-edge ZK coprocessor network, providing security to cross-chain bridges and interoperability protocols.

## How Wnode Interacts with Lagrange
Wnode deploys the Lagrange AVS node software. The agent connects to the EigenLayer `DelegationManager` to accept delegated stake and registers with the Lagrange `CommitteeManager`. The node continuously signs block headers of target rollups and submits them to the network.

## Example Agent Workflows
- **State Attestation**: The Wnode Lagrange container monitors the Arbitrum sequencer. When a new block is produced, Wnode signs the block header using its BLS key. Once a supermajority of the committee signs, a ZK proof is generated allowing dApps on Ethereum to trust the Arbitrum state instantly without waiting 7 days.

## Revenue Model (Real Incentives)
Wnode generates revenue via **AVS Restaking Yield**:
1. **AVS Rewards**: Lagrange pays node operators (and their delegators) for providing cryptoeconomic security and attestation services.
2. **Operator Commission**: Wnode charges a commission fee (e.g., 5-10%) on the yield generated for users delegating their ETH to the Wnode Lagrange node.

## Activation Steps
1. Register the Wnode identity as an EigenLayer Operator.
2. Opt-in to the Lagrange State Committee AVS contract.
3. Set `ENABLE_LAGRANGE_AVS=true` and provision the required node container.

## Limitations
- **Slashing Risk**: If the Wnode operator signs an invalid or malicious block header, the delegated restaked ETH is subject to severe slashing penalties enforced by EigenLayer.

## Future Upgrade Path
- Integrating with the Lagrange ZK Prover network, allowing Wnode operators with high-end GPUs to generate the actual SNARK/STARK proofs for the network in exchange for compute bounties.
