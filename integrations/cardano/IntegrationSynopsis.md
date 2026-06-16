# Cardano Integration Synopsis

## Protocol Overview
Cardano is a Layer 1 Settlement & Ledger Base utilizing the Extended Unspent Transaction Output (EUTXO) model and Ouroboros Praos/Leios consensus. It provides deterministic execution, mathematically proven security, and built-in liquid democracy via CIP-1694.

## Core Systems
- **Base Protocol**: Native ADA collateralization, deterministic fee calculation, and multi-asset routing without smart contracts required for basic UTXOs.
- **Plutus Smart Contracts**: EUTXO-driven programmable logic via Plutus V3, Aiken, and Plutarch, utilizing inline datums and reference inputs.
- **Hydra (L2 State Channels)**: Isomorphic multi-party state channels operating parallel to the main ledger for sub-second micro-payments and agent coordination.
- **Mithril Light Clients**: Cryptographic certified state aggregation via ATMS signatures, allowing edge devices to verify state without syncing the chain.
- **Governance (CIP-1694)**: On-chain decentralized governance using DReps, SPOs, and a Constitutional Committee.
- **Cross-Chain Interoperability**: Decentralized bridge models (e.g., Rosen Bridge) utilizing Plutus cryptographic primitives to verify external chain activities (SECP, BLS).

## Technical Highlights
- **State Model**: EUTXO provides predictable, deterministic execution eliminating MEV front-running.
- **Gas Model**: Deterministic fee calculation based on transaction size prevents gas spikes. 
- **Lightweight Verification**: Mithril allows hardware/IoT nodes to participate with minimal storage overhead.

## Recommended Usage for Wnode
- **AI Agents**: Deploy native cryptographic identities and utilize Hydra for high-speed, direct agent-to-agent negotiations.
- **DePIN Networks**: Register hardware directly on-chain and utilize Mithril for trustless verification of network rewards.
- **M2M Settlement**: Batch micro-payments into single L1 transactions or leverage Hydra channels for continuous streaming payments.
- **Onchain Treasuries**: Utilize CIP-1694 structures and Plutus multisigs for highly secure capital allocation.
- **Cross-Chain Flows**: Use Mithril certificates as a foundational proof layer and Plutus V3 for native SECP signature verification.
