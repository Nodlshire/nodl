# Kamino Finance Integration Overview

## What is Kamino?
Kamino is a dominant decentralized finance protocol on Solana, initially built for Automated Liquidity Management (ALM) on Orca and Raydium, and recently expanded into Kamino Lend (a massive money market) and Multiply (1-click leverage).

## Why Wnode Integrates with Kamino
While Kamino automates DEX liquidity internally, navigating its lending markets and Multiply vaults to optimize for Kamino Points (KMNO) and real yield requires external orchestration. Wnode integrates to automate leveraged yield farming loops on Solana.

## How Wnode Interacts with Kamino
Wnode interfaces with the Kamino Lend program. Instead of simple lending, the Wnode agent automates recursive borrowing (Looping) to hyper-leverage capital efficiency, maximizing APY and protocol point accrual.

## Example Agent Workflows
- **JitoSOL/SOL Looping**: Wnode deposits SOL into Kamino Lend, borrows LSTs (e.g., JitoSOL), swaps them back to SOL, and deposits them again. Wnode continuously monitors the borrow APY vs. the LST staking APY, unwinding the loop automatically if the spread becomes unprofitable.
- **ALM Vault Rebalancing**: Wnode agents acting as external market makers to optimize Kamino's own liquidity vaults by triggering their rebalance functions when volatility spikes.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Leveraged Yield Fees**:
1. **Yield Optimization**: Wnode extracts peak yield through complex looping. The protocol charges a performance fee (e.g., 2% of generated yield) for managing the liquidation risk of these highly leveraged positions.
2. **Airdrop/Points Farming**: Aggressive points farming on behalf of users, maximizing future Kamino token allocations.

## Activation Steps
1. Connect Wnode to the Solana blockchain.
2. Define maximum leverage limits (e.g., 3.5x loop limit) to protect against liquidation wicks.
3. Set `ENABLE_KAMINO_LOOPER=true`.

## Limitations
- Highly sensitive to Solana Oracle updates. Flash crashes in SOL price can liquidate Kamino Multiply vaults instantly. The Wnode agent must be connected to Pyth network feeds to unwind the leverage preemptively before Kamino liquidators strike.

## Future Upgrade Path
- Integrating with Kamino Creator Vaults to allow Wnode to deploy its own custom, algorithmic yield vaults directly onto the Kamino frontend for public retail investment.
