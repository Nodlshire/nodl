# Technical Integration Spec: paraswap

## Endpoints
REST: https://api.paraswap.io
RPC: N/A

## Flows
Supported Chains: Ethereum, Polygon, Avalanche, Arbitrum, Optimism, Base
Supported Assets: USDC, USDT, ETH, DAI

## Security & Idempotency
Auth: API key for rate limits
Idempotency: None
Security Model: EVM smart contract-based trade dispatching with slippage bounds
