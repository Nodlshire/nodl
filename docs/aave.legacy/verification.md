# Aave Verification and References

This document provides links to official Aave documentation that validates the math, architecture, and contracts used in our integration.

### Core Protocol & Contracts
- **[Aave V3 Pool Contract](https://docs.aave.com/developers/core-contracts/pool)**: The primary contract used in our integration for `supply`, `withdraw`, and `liquidationCall`. Our `abi.ts` aligns directly with these interface definitions.
- **[Aave V3 Oracles](https://docs.aave.com/developers/core-contracts/aaveoracle)**: Used in our `PriceMonitor` to fetch canonical asset prices.

### Risk and Math
- **[Health Factor](https://docs.aave.com/risk/asset-risk/risk-parameters#health-factor)**: Explains the math behind the Health Factor. Our `HealthMonitor` uses this exact threshold (HF < 1.0) to determine liquidation eligibility.
- **[Liquidations](https://docs.aave.com/developers/guides/liquidations)**: Details the liquidation penalty mechanisms and the maximum debt that can be covered (Close Factor), which our `LiquidationDetector` uses to calculate profitability.
- **[Risk Parameters](https://docs.aave.com/risk/asset-risk/risk-parameters)**: Documents the specific LTV, Liquidation Thresholds, and Liquidation Bonuses per asset.

*Note: We do not replicate Aave's documentation directly. These links serve as the canonical source of truth for our integration's parameters.*
