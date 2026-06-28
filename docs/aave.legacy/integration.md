# Aave V3 Integration: Technical Overview

## Introduction
Wnode integrates with Aave V3 to provide advanced automation capabilities, including health-factor monitoring, liquidation detection, liquidation execution, idle balance routing, and price monitoring.
This integration utilizes `ethers.js` to perform real, on-chain contract interactions and read state securely via public or private RPC endpoints.

## Supported Networks & RPCs
Our integration is designed to support multiple networks where Aave V3 is deployed. Currently configured networks include:
- **Ethereum Mainnet** (Requires `AAVE_MAINNET_RPC_URL` env variable)
- **Arbitrum** (Requires `AAVE_ARBITRUM_RPC_URL` env variable)

*Note: Addresses for Pool, PoolDataProvider, and Oracles are managed centrally in `config.ts`.*

## Module Structure
The integration is broken into several isolated modules located in `integrations/standby/aave-v3/aave_automation/`:
- `health_monitor.ts`: Computes user health factors using `getUserAccountData`.
- `liquidation_detector.ts`: Identifies underwater positions.
- `liquidation_executor.ts`: Submits or simulates `liquidationCall` transactions.
- `idle_router.ts`: Manages `supply`/`withdraw` of idle assets.
- `price_monitor.ts`: Interacts with Aave Oracles for asset pricing.

## Safety and Feature Flags
All automation features are **disabled by default**. They are protected by environment-level feature flags in `config.ts`:
- `ENABLE_AAVE_HEALTH_MONITORING`
- `ENABLE_AAVE_LIQUIDATIONS`
- `ENABLE_AAVE_AUTO_ROUTING`
- `ENABLE_AAVE_PRICE_MONITORING`

Write actions (Liquidations, Routing) strictly require these flags to be enabled and feature a built-in `dryRun` mode for simulated execution without broadcasting.

## Testing

### Unit Tests
Unit tests use mocked provider objects to verify safety checks and disabled states.
```bash
npx jest integrations/standby/aave-v3/__tests__/automation.test.ts
```

### End-to-End (E2E) Tests
We include an E2E test suite that connects to a real RPC provider to read live Aave on-chain state. These tests are skipped by default.
To run them, you must supply an RPC URL and specifically point jest to the file:
```bash
AAVE_MAINNET_RPC_URL="https://your.rpc.url" npx jest integrations/standby/aave-v3/__tests__/e2e.test.ts
```
