# LayerZero DVN Integration Overview

## What is LayerZero?
LayerZero (V2) is an omnichain interoperability protocol that enables censorship-resistant message passing across blockchains. V2 introduces Decentralized Verifier Networks (DVNs), allowing dApps to custom-select multiple independent verification networks to secure their cross-chain payloads.

## Why Wnode Integrates with LayerZero
Wnode integrates to run an independent **Decentralized Verifier Network (DVN)**. By leveraging the decentralized hardware mesh, Wnode can provide a highly secure, sovereign verification option for dApps bridging assets or data.

## How Wnode Interacts with LayerZero
Wnode operates a DVN infrastructure node. It monitors the `EndpointV2` contracts on origin chains. When a cross-chain message is sent by a dApp that selected Wnode as a DVN, the agent verifies the block state and commits the payload hash to the destination chain `EndpointV2`.

## Example Agent Workflows
- **Cross-Chain Verification**: A user bridges an NFT from Ethereum to Polygon. The Wnode DVN listens to Ethereum, confirms the transaction has achieved finality (e.g., 2 epochs), and submits the cryptographic verification to Polygon. Once all configured DVNs agree, the message is executable.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Verification Fees**:
1. **Per-Message Bounties**: DApps that select the Wnode DVN pay a verification fee (in native gas tokens) upfront for every message processed. Wnode captures this fee minus the destination chain gas costs.

## Activation Steps
1. Deploy the DVN smart contracts on all supported LayerZero chains.
2. Register the DVN with the LayerZero protocol to make it selectable by dApps.
3. Set `ENABLE_LAYERZERO_DVN=true` and configure RPCs for all monitored chains.

## Limitations
- Destination chain gas volatility can erode verification margins if fees are not dynamically updated via the DVN's off-chain pricing oracle.
- High hardware overhead: Running a DVN requires maintaining synced full nodes or highly reliable RPCs for 40+ different blockchains.

## Future Upgrade Path
- Integration with Polyhedra (zkBridge) to utilize ZK-proofs for LayerZero message verification, reducing destination chain gas costs.
