# Sui Integration Synopsis

## Protocol Overview
Sui is a high-performance Layer 1 Blockchain utilizing an object-centric storage model where global state is a collection of programmable objects with globally unique IDs. It leverages the Mysticeti DAG-based consensus protocol, optimizing for ultra-low latency.

## Architecture
- **Data Model**: Object-centric (Owned, Shared, Immutable objects).
- **Consensus Engine**: Mysticeti for ultra-low latency and consensus decoupling.
- **Scaling Mechanism**: Horizontal scaling via intra-validator sharding.

## Features
- **Execution Model**: Dual-path engine (single-owner bypasses total-order consensus; shared objects require sequencing). Programmable Transaction Blocks (PTBs) allow batching up to 1024 commands.
- **RPC Surface**: High-throughput Protobuf binary over gRPC (SuiGrpcClient) and SuiGraphQLClient. Legacy JSON-RPC is deprecated.
- **SDKs**: @mysten/sui (TypeScript/JavaScript), sui-rust-sdk, Python, Go, C++/Unity/Unreal Engine.
- **DID & Identity**: zkLogin (OIDC credentials via zero-knowledge proofs), Sui Name Service (SuiNS), and native DIDs.
- **M2M Payments**: Sub-second single-owner paths enable high-frequency micro-payments and micro-metered settlement channels.
- **Stablecoin Flows & Liquidity**: DeepBook (native CLOB) for liquidity routing; native USDC, AUSD.
- **Gas Model**: Computation and Storage units; Storage Fund for state history incentives; Gas Sponsored Transactions (zero fee transfers).
- **Move VM**: Sui Move (object-centric) utilizing explicit abilities (key, store, copy, drop) and strict bytecode verifier for structural safety.
- **Cross-Chain**: Sui Bridge, Wormhole, LayerZero. 

## Integration Patterns
- State tracking via Object Mutations and Event emissions (no sequential block tracking).
- Transaction construction via Programmable Transaction Blocks (PTBs).
- Storage layering via Walrus (decentralized blob storage).

## Recommended Usage
- High-frequency DeFi (Central Limit Order Books, sub-second settlement).
- Web3 Gaming (Dynamic NFTs, parallel execution).
- Mass-market consumer applications (zkLogin).
- High-throughput enterprise supply chains.
