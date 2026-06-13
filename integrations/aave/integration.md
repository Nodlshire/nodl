# Aave Integration Overview

## What is Aave?
Aave is a decentralized, open-source, and non-custodial liquidity protocol on Ethereum and other networks. Users can participate as depositors or borrowers. Depositors provide liquidity to the market to earn a passive income, while borrowers are able to borrow in an overcollateralized (perpetually) or undercollateralized (one-block liquidity) fashion.

## Why Wnode Integrates with Aave
Integrating with Aave allows Wnode to offer its users seamless access to decentralized lending and borrowing markets. By bringing Aave's liquidity directly into the Wnode ecosystem, node operators and end-users can automatically route idle balances to earn yield or leverage positions across supported assets.

## How Wnode Interacts with Aave
The integration utilizes the Aave V3 protocol interfaces via `ethers.js`. It securely manages health-factor monitoring, programmatic deposits and withdrawals, and liquidation detection using strictly controlled, non-destructive read paths and opt-in execution layers.

## Example Agent Calls
- **Health Monitor**: Automatically queries `getUserAccountData` to monitor position health.
- **Idle Router**: Detects idle funds and executes `supply` to earn yield.
- **Advanced Liquidation Executor**: Executes `liquidationCall` via MEV flashbots when an underwater position is detected.

## Example Workflows
1. **Automated Yield Generation**: A user enables auto-routing. The Wnode agent monitors their wallet and automatically supplies USDC to the Aave pool when the balance exceeds a set threshold.
2. **Flashloan Liquidation**: When health factor drops below 1.0, Wnode takes an Aave/Balancer flashloan for the exact `debtToCover` (determined by the V3 close factor), executes `liquidationCall`, receives the underlying collateral + penalty, swaps it on a DEX to repay the flashloan, and pockets the spread in a single atomic block.

## Revenue Model
This integration generates revenue for Wnode and node operators through:
1. **Liquidation Bonuses**: Participating in the liquidation of underwater positions on lower-competition L2s.
2. **Yield Optimization Fees**: Taking a minimal performance fee on the automated idle balance routing yield.

## Activation Steps
To enable the Aave automation modules on a Wnode instance:
1. Configure valid RPC URLs (`AAVE_MAINNET_RPC_URL`, etc.) in the environment.
2. Enable the required feature flags (e.g., `ENABLE_AAVE_HEALTH_MONITORING=true`).
3. Start the Wnode orchestration engine.

## Limitations
- MEV Competition: Executing liquidations on Ethereum Mainnet is highly competitive. Wnode requires optimized Flashbots/Builder0x69 relay bundles to prevent toxic flow and gas wars.
- Only Ethereum Mainnet and Arbitrum are currently configured with hardcoded contract addresses.

## Future Upgrade Path
- **E-Mode Arbitrage**: Tracking High Efficiency Mode (E-Mode) isolated pairs (e.g., stETH/ETH) for hyper-leveraged liquidation opportunities.
- **Portal V3 Bridge Execution**: Acting as a decentralized relayer for Aave's native cross-chain Portal feature.
