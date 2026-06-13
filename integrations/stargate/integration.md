# Stargate Finance (V2) Integration Overview

## What is Stargate Finance?
Stargate Finance V2 is a fully composable native asset bridge built on top of LayerZero. V2 introduces dynamic batching of cross-chain payloads (Hydra), AI-driven fee adjustments, and reliant execution networks on destination chains.

## Why Wnode Integrates with Stargate
Wnode integrates with Stargate to provide deep liquidity automation and to act as a **Destination Execution Keeper**. V2 requires third-party actors to pay the gas on destination chains to finalize cross-chain swaps, presenting an execution bounty model.

## How Wnode Interacts with Stargate
Wnode interfaces with the `StargateV2Router` and the `LayerZero Endpoint V2`. Wnode listens to the network for verified LayerZero packet proofs. Once a packet is verified, Wnode calls `lzReceive` on the destination chain to finalize the user's bridge transaction.

## Example Agent Workflows
- **Destination Executor**: A user bridges from Ethereum to Base. They pay a quoted fee on Ethereum. The Wnode agent running on Base detects the finalized LayerZero proof, pays the Base execution gas to finalize the transfer, and claims the quoted execution fee as a refund + profit margin.
- **Automated Batched Yield**: Wnode pools multiple users' LP deposits and executes a single batched transaction into Stargate V2's Hydra module to minimize bridging gas overhead.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Execution Premiums**:
1. **Execution Margins**: Wnode profits from the spread between the user's quoted execution fee on the origin chain and the actual gas cost paid by the agent on the destination chain.
2. **LP Auto-Farming**: Charging performance fees on STG emissions earned through automated liquidity provision.

## Activation Steps
1. Configure cross-chain RPC providers (specifically targeting low-fee L2s as destinations).
2. Fund the Wnode execution wallets with native gas tokens (ETH, MATIC, AVAX) on all destination networks.
3. Set `ENABLE_STARGATE_DESTINATION_KEEPER=true`.

## Limitations
- High execution risk: If destination gas prices spike drastically before the packet arrives, the quoted fee may not cover the execution cost, resulting in temporary unprofitability.

## Future Upgrade Path
- Integration with LayerZero V2 decentralized Verifier networks (DVNs) to provide independent security consensus for Stargate bridging events.
