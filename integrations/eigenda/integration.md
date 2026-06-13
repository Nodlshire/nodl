# EigenDA Integration Overview

## What is EigenDA?
EigenDA is a highly scalable Data Availability (DA) layer built on EigenLayer. It is the first Actively Validated Service (AVS) on the network, designed to provide cheap and secure data storage for Ethereum rollups by leveraging restaked ETH and KZG commitments.

## Why Wnode Integrates with EigenDA
EigenDA requires decentralized Node Operators to download data blobs, verify them against KZG commitments, and sign attestations. Wnode integrates to provide the robust, high-bandwidth hardware nodes required to operate the network.

## How Wnode Interacts with EigenDA
Wnode deploys the official EigenDA Node binary. It interfaces with the `DelegationManager` to accept delegated restaked ETH. The node continuously connects to the EigenDA disperser to receive blobs and submits BLS signatures attesting to the availability of the data.

## Example Agent Workflows
- **DA Node Operation**: Wnode operators spin up EigenDA instances. The node automatically handles the ingress of rollup data, verifies the KZG proofs, signs the batch, and propagates the signature to the EigenDA aggregator, providing security to L2s like Mantle and Base.

## Revenue Model (Real Incentives)
Wnode generates revenue via **AVS Yield & Operator Commissions**:
1. **DA Fees**: Rollups pay EigenDA for data storage. These fees are distributed to Node Operators and their delegators in the form of ETH or EIGEN tokens.
2. **Operator Commission**: Wnode operators charge a configurable commission fee on the yield earned by users who delegate their restaked ETH to the Wnode validator identity.

## Activation Steps
1. Register the Wnode identity as an EigenLayer Operator.
2. Opt-in to the EigenDA AVS contract on Ethereum mainnet.
3. Provision a high-bandwidth node and set `ENABLE_EIGENDA_AVS=true`.

## Limitations
- **Bandwidth Requirements**: EigenDA node operators must ingest gigabytes of data per day. Unmetered, high-speed fiber internet is a strict hardware requirement.

## Future Upgrade Path
- Integration with EigenDA dual-quorum mechanics, allowing Wnode operators to restake EIGEN tokens alongside ETH to maximize dual-yield attestation rewards.
