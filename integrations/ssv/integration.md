# SSV Network Integration Overview

## What is SSV Network?
SSV Network is a fully decentralized, open-source Distributed Validator Technology (DVT) network. It splits an Ethereum validator key into multiple KeyShares distributed across independent node operators. This ensures high availability, security, and fault tolerance for Ethereum staking.

## Why Wnode Integrates with SSV
Wnode operators can become active **Operators** on the SSV network. Because Wnode instances are geographically distributed and decentralized, they form an ideal hardware layer for running secure, fault-tolerant Ethereum validators.

## How Wnode Interacts with SSV
Wnode deploys the `ssv-node` binary within its containerized orchestration engine. It interacts with the `SSVNetwork` smart contract on Ethereum to register the node, accept KeyShares from stakers, and participate in distributed consensus via the iBFT protocol.

## Example Agent Workflows
- **DVT Node Operation**: A user wants to stake 32 ETH but minimize slashing risk. They split their key via SSV and select Wnode as one of the 4 operators. The Wnode agent automatically syncs the KeyShare and begins proposing/attesting blocks in coordination with the other 3 operators.
- **Automated SSV Sweeping**: Wnode automatically claims accrued SSV operator fees from the smart contract to pay for ongoing node hardware costs.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Operator Fees**:
1. **Network Fees**: Wnode operators set a custom fee (denominated in SSV tokens) charged to the stakers utilizing their node. This fee accrues continuously based on blocks validated.
2. **Incentive Programs**: Participating in official SSV DAO mainnet incentive campaigns for high-performance operators.

## Activation Steps
1. Provision Ethereum execution and consensus clients on Wnode.
2. Deploy the `ssv-node` container and register the operator public key on-chain.
3. Set `ENABLE_SSV_OPERATOR=true`.

## Limitations
- Requires a minimum balance of SSV tokens locked as an operator bond to prevent malicious behavior.
- Highly dependent on the uptime and latency of the other operators in the DVT cluster to successfully sign blocks.

## Future Upgrade Path
- Native integration with Lido's Simple DVT module to allow Wnode SSV operators to automatically ingest Lido's institutional staking flow.
