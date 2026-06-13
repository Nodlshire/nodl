# Convex Finance Integration Overview

## What is Convex Finance?
Convex Finance is a yield-boosting protocol built on top of Curve Finance. It pools users' Curve LP tokens and CRV to accumulate a massive treasury of veCRV (vote-escrowed CRV). This allows individual LPs to earn maximum boosted CRV yields and CVX tokens without needing to personally lock their own CRV for 4 years.

## Why Wnode Integrates with Convex
Convex is the foundational layer of the "Curve Wars." By integrating with Convex, Wnode can offer users maximum baseline DeFi yields while automating the highly complex process of claiming rewards, compounding, and voting in bribe marketplaces.

## How Wnode Interacts with Convex
Wnode agents interface with the `Booster` contract to deposit Curve LP tokens, and the `BaseRewardPool` to execute `getReward()`. For governance, Wnode interacts with the `vlCVX` contract and snapshot voting APIs to route voting power to the highest-bidding pools on platforms like Votium.

## Example Agent Workflows
- **Auto-Bribing (vlCVX)**: A user locks CVX into vlCVX. Every 2 weeks, the Wnode agent automatically analyzes the Votium bribe marketplace and submits snapshot votes for the gauges offering the highest dollar-per-vote return.
- **Max-Yield Compounding**: Wnode claims CVX and CRV rewards, instantly swaps them for the underlying Curve LP assets, and redeposits them into the `Booster` to continuously maximize compound interest.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Bribe Optimization & Management Fees**:
1. **Bribe Revenue**: Direct extraction of protocol bribes (e.g., LDO, FXS, SPELL) paid to vlCVX voters. Wnode takes a small execution cut for automating the voting and claiming process.
2. **Compounding Fees**: A flat performance fee applied to the autocompounded yield spread.

## Activation Steps
1. Deposit Curve LP tokens into the Convex `Booster` via the Wnode dashboard.
2. Alternatively, lock CVX into `vlCVX` and delegate voting power to the Wnode agent.
3. Set `ENABLE_CONVEX_AUTOMATION=true`.

## Limitations
- Bribe harvesting requires claiming dozens of small, obscure tokens. On Ethereum Mainnet, the gas costs to claim and swap these micro-bribes can exceed the value of the bribe itself unless heavily batched.

## Future Upgrade Path
- Native integration with LlamaAirforce's Union to seamlessly mutualize gas costs for claiming Votium bribes.
