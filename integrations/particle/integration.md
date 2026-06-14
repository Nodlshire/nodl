# Technical Integration Spec: particle

## Endpoints
REST: https://api.particle.network
RPC: N/A

## Flows
Supported Chains: Ethereum, Polygon, Base, Arbitrum, Optimism, Solana
Supported Assets: USDT, USDC, ETH, POL

## Security & Idempotency
Auth: Particle Dashboard app ID, Client Key, Project ID
Idempotency: Signature-based transaction tracking prevents duplicate executions
Security Model: Multi-Party Computation (MPC-TSS) key management
