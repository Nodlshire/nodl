# Redacted Cartel (Hidden Hand) Integration Overview

## What is Hidden Hand?
Hidden Hand is a generalized bribe marketplace built by Redacted Cartel. It allows protocols to deposit reward tokens (bribes) to incentivize users who hold vote-escrowed governance tokens (like veBAL, vlAURA, vePENDLE, or vlCVX) to vote for their specific liquidity gauges.

## Why Wnode Integrates with Hidden Hand
Users who participate in bribe marketplaces receive payouts in dozens of fragmented, illiquid micro-tokens. The gas costs to manually claim and swap these tokens on Ethereum Mainnet often destroy the actual yield. Wnode integrates to fully automate this exact problem.

## How Wnode Interacts with Hidden Hand
Wnode interfaces with the `HiddenHandRewardPool` contracts across multiple chains. It uses the Hidden Hand API to determine optimal snapshot voting arrays, executes the votes, and performs highly optimized batch-claims of the resulting reward tokens.

## Example Agent Workflows
- **Automated Bribe Sweeping**: Once per epoch, Wnode calls `claimRewards` on behalf of a delegated user, sweeping 15+ different protocol tokens. It atomically bundles these claims with a DEX aggregator swap (via 1inch or Paraswap) to convert the fragmented dust into a single liquid asset like USDC or ETH.
- **Max-Yield Voting**: Wnode analyzes the Hidden Hand API for the highest dollar-per-vote ratio and automatically signs the snapshot vote for the delegated wallet.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Bribe Optimization Fees**:
1. **Gas Abstraction Fee**: Because Wnode saves the user hundreds of dollars in manual claiming gas, Wnode takes a percentage cut (e.g., 5-10%) of the total recovered USDC equivalent before transferring it to the user.

## Activation Steps
1. A user locks their governance tokens (e.g., AURA, BAL, PENDLE) on the respective platforms.
2. The user delegates snapshot voting power to the Wnode execution wallet.
3. Set `ENABLE_HIDDENHAND_SWEEPER=true`.

## Limitations
- Swapping highly illiquid bribe tokens on DEXes can incur massive slippage. The Wnode agent must mathematically verify that routing the swap through 1inch provides a positive net return; otherwise, it must hold the token until liquidity improves.

## Future Upgrade Path
- Native integration with Redacted's Pirex protocol to automate the auto-compounding of pxCVX and pxGMX liquid wrappers directly into the Wnode ecosystem.
