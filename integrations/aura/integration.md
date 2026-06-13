# Aura Finance Integration Overview

## What is Aura Finance?
Aura Finance is to Balancer what Convex is to Curve. It is a protocol built to accumulate veBAL (vote-escrowed BAL) to provide maximum boosted yields to Balancer liquidity providers and Aura stakers.

## Why Wnode Integrates with Aura
Balancer LPs are forced to lock 80/20 BAL/WETH BPTs to achieve maximum yields. Aura abstracts this away. Wnode integrates with Aura to automate the deposit of Balancer BPTs, harvest boosted BAL and AURA rewards, and automate bribe voting.

## How Wnode Interacts with Aura
Wnode interfaces with Aura's `Booster` contract to stake Balancer Pool Tokens (BPTs). It calls `getReward()` on Aura reward contracts and interacts with the `vlAURA` delegation contracts to route voting power to platforms like Hidden Hand.

## Example Agent Workflows
- **Aura Compounding Engine**: Wnode monitors an active Balancer LP position staked in Aura. It routinely claims BAL and AURA, wraps/swaps them, and redeposits them into the core Balancer pool to mint new BPTs, expanding the principal position.
- **vlAURA Bribe Routing**: Automatically routing locked AURA voting power to the highest-yielding gauges on the Hidden Hand bribe market.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Yield Optimization Fees**:
1. **Boosted Yield Arbitrage**: Users earn max-boosted BAL plus AURA emissions.
2. **Performance Cut**: Wnode charges an execution fee on the auto-compounded yield and a management fee for optimizing `vlAURA` bribe claims.

## Activation Steps
1. Supply liquidity to Balancer to acquire BPTs.
2. Configure Wnode to automatically deposit BPTs into the Aura `Booster`.
3. Set `ENABLE_AURA_HARVESTER=true`.

## Limitations
- The AURA token emission schedule decays over time. The agent's profitability matrix must dynamically adjust gas execution thresholds as nominal AURA rewards decrease.

## Future Upgrade Path
- Integrating automated auraBAL minting arbitrages, instantly swapping deposited BAL/WETH BPTs for auraBAL when the auraBAL secondary market trades at a discount to NAV.
