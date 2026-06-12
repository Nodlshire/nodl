# Aave Automation: Revenue Mechanics

The Aave automation modules are designed to generate revenue for Wnode and our node operators through structural market efficiencies.

## 1. Liquidation Bonuses
When a borrower's health factor drops below 1.0, third parties can repay a portion of the debt in exchange for the borrower's collateral plus a **liquidation penalty** (usually 5-10% depending on the asset). 
- **Conservative Scenario:** Executing liquidations on lower-volume L2s (like Arbitrum) with minimal competition could yield a steady trickle of 5% bonuses on smaller underwater accounts.
- **Aggressive Scenario:** Competing on Ethereum Mainnet using MEV/priority fees to liquidate massive positions during high market volatility.

## 2. Yield from Idle Balance Routing
Idle tokens in protocol-controlled wallets generate no return. By routing these assets into Aave pools, the protocol earns the current APY for that asset (e.g., 3-8% on stablecoins).
- **Conservative Scenario:** Only routing highly liquid stablecoins (USDC/USDT) to minimize volatility risk while earning standard supply APY.
- **Moderate Scenario:** Utilizing asset-specific loops or recursive lending if market conditions present delta-neutral yield opportunities.

## 3. Priority Fees / MEV
By monitoring Oracles and the mempool, Wnode can position its liquidation transactions favorably, ensuring execution in the exact block where an account becomes liquidatable, capturing value that would otherwise go to generalized searchers.
