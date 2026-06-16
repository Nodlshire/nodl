# Tether Integration Synopsis

## Protocol Overview
Wnode is integrating a complete, protocol-level view of Tether, building upon the existing tether-gold (XAUt) integration. The dataset covers USDT across major chains (Ethereum, Tron, Base, Polygon), Tether Gold (XAUt), and emerging M2M / machine payment rails.

## Categories
- Fiat-backed stablecoin
- Gold-backed token
- Settlement rail
- M2M payments

## Architecture
- **Backing Model**: Reserves structure (cash, T-bills, other assets). For XAUt: physical gold storage, vaulting, and allocation.
- **Issuance Model**: Minting mechanics, authorized minters, and on/off-ramp processes.
- **Redemption Model**: Redemption mechanics, minimum sizes, and settlement timelines.
- **Attestations & Audits**: Reserve attestation frequency and onchain verification.

## Execution Model
- Chain-specific transfers and constraints.
- Settlement patterns for high-frequency flows.

## Identity & Compliance
- KYC/KYB requirements for direct issuance/redemption and large flows.
- Blacklisting and freezing capabilities.
- Onchain enforcement of sanctions and compliance.

## M2M Payments
- Usage of USDT and XAUt in DePIN, AI agents, M2M payments, and cross-border settlement.
- Constraints on M2M usage including compliance and rate limits.

## Cross-Chain Capabilities
- Movement of USDT between chains (bridges, burn/mint, custodial routing).
- Official Tether-supported bridging mechanisms.

## Recommended Usage for Wnode
- AI agents
- DePIN networks
- M2M settlement
- Onchain treasuries
- Cross-border flows
