# Liquity Integration Overview

## What is Liquity?
Liquity is a decentralized borrowing protocol that allows users to draw interest-free loans against ETH used as collateral. Loans are paid in LUSD (a USD-pegged stablecoin). Troves (borrowing positions) must maintain a minimum collateral ratio of 110%. The protocol uses a Stability Pool as the primary liquidity source to absorb underwater Troves.

## Why Wnode Integrates with Liquity
Liquity relies entirely on decentralized, third-party operators (Keepers) to execute liquidations and maintain system solvency. Wnode integrates to provide this execution layer, earning protocol-guaranteed liquidation bounties.

## How Wnode Interacts with Liquity
Wnode interfaces with the `TroveManager` and `StabilityPool` contracts. The agent continuously calculates the collateral ratio (CR) of all open Troves based on the Chainlink ETH/USD oracle price. When a Trove drops below 110%, Wnode executes the `liquidateTroves` function.

## Example Agent Workflows
- **Trove Liquidator**: A Wnode agent monitors the mempool for ETH price drops. When the ETH price falls and pushes a Trove's CR to 109%, Wnode instantly submits the liquidation transaction. The underwater debt is canceled against the Stability Pool.
- **Stability Pool Compounder**: Automatically claiming LQTY and ETH rewards from the Stability Pool, swapping them for LUSD, and restaking them into the pool to compound yield.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Liquidation Penalties**:
1. **Gas Compensation**: Liquidators receive 200 LUSD (funded by a reserve set aside during Trove creation) plus the exact ETH gas cost of the transaction.
2. **Collateral Penalty**: Liquidators receive an additional 0.5% of the Trove's total ETH collateral as a profit margin.

## Activation Steps
1. Configure a low-latency Ethereum RPC.
2. Deploy the Wnode Liquity Keeper container.
3. Set `ENABLE_LIQUITY_LIQUIDATOR=true`.

## Limitations
- **Recovery Mode**: If the Total Collateral Ratio (TCR) of the entire system falls below 150%, Troves with CRs below 150% become liquidatable. The agent's logic must dynamically adapt to tracking TCR to capitalize on Recovery Mode liquidations.

## Future Upgrade Path
- Integration with Liquity V2 (which introduces user-set interest rates and multi-collateral backing) to automate interest rate arbitrage.
