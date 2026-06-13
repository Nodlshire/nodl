# Obol Network Integration Overview

## What is Obol Network?
Obol is a Distributed Validator Technology (DVT) network that promotes the creation of Distributed Validator Clusters (DVCs). It uses a middleware client called **Charon** to intercept communication between Ethereum execution and consensus clients, allowing multiple operators to run a single validator key safely.

## Why Wnode Integrates with Obol
Wnode integrates with Obol to provide resilient, enterprise-grade staking infrastructure. Obol DVT heavily mitigates the risk of downtime slashing, making Wnode operators highly attractive to institutional stakers and liquid staking protocols (like Lido).

## How Wnode Interacts with Obol
Wnode deploys the `Charon` middleware client alongside standard Ethereum execution (Geth/Nethermind) and consensus (Lighthouse/Teku) clients. The Wnode orchestrator manages the Charon Distributed Key Generation (DKG) ceremony and securely stores the resulting KeyShare.

## Example Agent Workflows
- **Cluster Participation**: Four Wnode operators in different geographic regions run a 4-node Obol cluster. When it is their validator's turn to propose a block, Charon negotiates consensus among the 4 nodes. If one node goes offline, the remaining 3 successfully propose the block, ensuring 100% uptime.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Staking Commissions**:
1. **Validator Rewards**: Earning consensus layer (attestations) and execution layer (MEV/Priority fees) rewards.
2. **Institutional Flow**: Wnode operators running Obol DVT can participate in Lido's Simple DVT module, receiving delegated ETH from Lido and earning a commission on the generated yield.

## Activation Steps
1. Coordinate a Distributed Key Generation (DKG) ceremony with other cluster operators.
2. Provision the Wnode with Charon, Execution, and Consensus containers.
3. Set `ENABLE_OBOL_CHARON=true`.

## Limitations
- Cluster performance is heavily reliant on the latency and stability of the *slowest* node in the DVC. Coordination requires robust networking configurations to prevent missed attestations.

## Future Upgrade Path
- Automated DKG participation, allowing Wnode nodes to dynamically form ad-hoc Obol clusters with other highly-rated Wnode operators in the mesh without human coordination.
