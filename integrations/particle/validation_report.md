# Validation Report: particle

## 1. Endpoints
- REST: https://api.particle.network
- RPC: None
- GraphQL: None
- WebSocket: None

## 2. Authentication
- Requirement: Particle Dashboard app ID, Client Key, Project ID
- Keys/Credentials: API Keys

## 3. Rate Limits & Safety
- Rate Limits: Unknown/None
- Idempotency Requirements: Signature-based transaction tracking prevents duplicate executions
- Mev Protection/Risk: Private bundler routes prevent simple sandbox frontrunning on supported chains
