# Wnode Integrations Registry

Wnode integration modules define canonical JSON workflows and strict deterministic parameters for external protocols. All modules are located in the `integrations/` directory of the SDKs.

## 1. Aave Health Monitor
**Type**: Read-Only
- Monitors `healthFactor` for Aave V3 positions.
- **Determinism Flags**: `requireFinalized: true`.
- Emits Proof of Compute for verifiable liquidation alerting without manual simulation variance.

## 2. Chainlink Price Feed
**Type**: Oracle Validation
- Fetches `latestRoundData` across price feeds.
- Cross-validates `updatedAt` and `roundId` against mesh-wide thresholds.
- Requires finalized blocks to prevent MEV manipulation of answers.

## 3. Chainlink VRF
**Type**: Write-Simulation
- Generates raw calldata for `fulfillRandomWords`.
- Simulates the fulfillment callback strictly against `blockTag: finalized` to generate a `ProofOfCompute` hash for the VRF consumer's resulting state.