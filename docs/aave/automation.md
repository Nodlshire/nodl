# Aave Automation Capabilities

This document explains the concrete automation tasks implemented within the Wnode Aave integration using real on-chain reads via `ethers.js`.

## 1. Health-Factor Monitoring
**What it does:** Periodically checks the "health" of an Aave user's borrow position to ensure it isn't close to liquidation.
**How it works:** It queries the `getUserAccountData` function on the live Aave Pool contract to read the raw health factor scalar. It mathematically converts the 1e18 scalar to a readable number. If it drops below 1.1, an internal alert is triggered.
**Control:** Enabled via `ENABLE_AAVE_HEALTH_MONITORING`.

## 2. Liquidation Detection
**What it does:** Scans multiple user positions to find accounts that are eligible to be liquidated (Health Factor < 1.0).
**How it works:** It iterates through a list of monitored positions and flags any that have fallen below the liquidation threshold.

## 3. Liquidation Execution
**What it does:** Executes a liquidation call against an underwater position to earn a liquidation penalty bonus.
**How it works:** It calls the `liquidationCall` function on the Aave Pool contract. It supports a "dry-run" mode utilizing `staticCall` to securely simulate the transaction against the current block state before actually spending gas.
**Control:** Enabled via `ENABLE_AAVE_LIQUIDATIONS`.

## 4. Idle Balance Routing
**What it does:** Automatically sweeps idle funds from a wallet into an Aave liquidity pool to earn passive yield.
**How it works:** It uses the `supply` function on the Aave Pool contract to deposit assets, and `withdraw` to pull them back when needed.
**Control:** Enabled via `ENABLE_AAVE_AUTO_ROUTING`.

## 5. Price/Oracle Monitoring
**What it does:** Tracks the on-chain price of assets to preemptively warn about potential liquidations or market volatility.
**How it works:** Queries the `getAssetPrice` function on the official Aave Oracle contracts to retrieve the canonical price feed value in real-time.
**Control:** Enabled via `ENABLE_AAVE_PRICE_MONITORING`.
