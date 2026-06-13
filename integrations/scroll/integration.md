# Scroll Integration Overview

## What is Scroll?
Scroll is a fully equivalent zkEVM Layer 2 network for Ethereum. It executes transactions off-chain and generates Zero-Knowledge proofs that attest to the correctness of the execution at the EVM bytecode level, offering massive scalability without compromising Ethereum's security.

## Why Wnode Integrates with Scroll
Scroll boasts a thriving DeFi ecosystem and a roadmap that includes decentralizing its ZK-Prover network. Wnode integrates to automate DeFi tasks (Point/Mark harvesting) and prepare infrastructure to run independent ZK-Prover nodes.

## How Wnode Interacts with Scroll
Wnode interacts with Scroll via standard EVM execution for DeFi interactions. In the future, Wnode will deploy the Scroll Prover binaries to generate the actual cryptographic proofs that secure the network.

## Example Agent Workflows
- **Scroll Marks Farming**: Wnode automates the process of bridging assets to Scroll and deeply integrating them into native protocols (like Ambient or SyncSwap) to algorithmically maximize the accumulation of "Scroll Marks" (network loyalty points).
- **ZK-Proof Generation (Future)**: Wnode utilizes heavy GPU compute nodes to rapidly calculate ZK-SNARK proofs for Scroll blocks, submitting them to the network for a bounty.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Yield Farming & Future Compute Bounties**:
1. **Airdrop Optimization**: Maximizing user allocation for the upcoming SCR token through automated on-chain interaction logic.
2. **Prover Bounties**: Wnode operators with high-end GPUs will earn native ETH/SCR tokens for processing the cryptography that secures the L2.

## Activation Steps
1. Configure the Scroll RPC.
2. Bridge ETH to Scroll via the native bridge.
3. Set `ENABLE_SCROLL_AUTO_FARMER=true`.

## Limitations
- The immediate revenue model relies entirely on the speculative valuation of Scroll Marks. Actual compute-based revenue requires waiting for the Scroll DAO to decentralize the prover network.

## Future Upgrade Path
- Deploying dedicated CUDA-accelerated GPU instances on the Wnode mesh specifically optimized for calculating Scroll's specialized Halo2 ZK-proofs.
