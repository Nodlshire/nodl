# Validation Report: paraswap

## 1. Endpoints
- REST: https://api.paraswap.io
- RPC: None
- GraphQL: None
- WebSocket: None

## 2. Authentication
- Requirement: API key for rate limits
- Keys/Credentials: Bearer token

## 3. Rate Limits & Safety
- Rate Limits: 20 requests per second (dependent on key level)
- Idempotency Requirements: None
- Mev Protection/Risk: Slippage limits and private routing models minimize sandwich attacks
