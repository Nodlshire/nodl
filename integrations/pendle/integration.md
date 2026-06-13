# Pendle Finance Integration Overview

## What is Pendle Finance?
Pendle is a permissionless yield-trading protocol. It allows users to execute complex yield strategies by tokenizing yield-bearing assets (e.g., stETH, sDAI) and splitting them into a Principal Token (PT) and a Yield Token (YT). PTs represent the fixed principal, while YTs represent the right to all yield generated until maturity.

## Why Wnode Integrates with Pendle
Pendle's AMM explicitly prices future yield, leading to frequent market inefficiencies where implied APY (priced by the AMM) diverges from the underlying APY. Wnode integrates with Pendle to execute automated yield arbitrage and manage rolling maturity dates.

## How Wnode Interacts with Pendle
Wnode interfaces with Pendle's `Router` and `Market` contracts. Agents utilize the Pendle SDK/Router to mint PT/YT, swap assets on the V2 AMM, and claim rewards via the `RewardManager`.

## Example Agent Workflows
- **Yield Arbitrage**: The Wnode agent monitors the Implied Yield (IY) of an stETH YT token. If the IY drops to 2% while the actual Lido staking APY is 4%, Wnode automatically buys the YT, holding it to extract the real yield delta.
- **Maturity Auto-Rolling**: When a PT (e.g., PT-stETH expiring Dec 2025) reaches maturity, Wnode automatically redeems the underlying asset and purchases a new PT in a further-dated pool to maintain a continuous fixed-yield ladder.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Arbitrage and Fixed-Yield Management**:
1. **Arbitrage Spreads**: Capturing absolute yield spread differentials between Pendle's AMM pricing and the underlying protocol's actual yield.
2. **Maturity Management Fees**: Charging users a premium to maintain "set and forget" fixed-yield portfolios via PT auto-rolling.

## Activation Steps
1. Connect Wnode to supported Arbitrum or Ethereum RPCs.
2. Deposit base assets into Wnode's smart contract wallet.
3. Set `ENABLE_PENDLE_ARBITRAGE=true`.

## Limitations
- Pendle PT/YT pricing mathematics are highly complex, relying on an advanced time-decaying AMM model. Off-chain pricing simulations require rigorous synchronization with on-chain block states.

## Future Upgrade Path
- Deep integration with Penpie or Equilibria (Convex equivalents for Pendle) to automate vePENDLE voting and bribe extraction.
