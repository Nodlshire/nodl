# Solend (Save) Integration Overview

## What is Solend?
Solend (currently rebranding to Save) is an established decentralized lending and borrowing protocol on Solana. It features a Main Pool for blue-chip assets and numerous Isolated Pools for high-risk, volatile tokens with custom liquidation parameters.

## Why Wnode Integrates with Solend
Similar to MarginFi, Solend requires external liquidators. The Isolated Pools, in particular, offer extremely lucrative liquidation opportunities due to higher penalty parameters for volatile assets.

## How Wnode Interacts with Solend
Wnode interfaces with the Solend protocol via its official on-chain programs. Agents continuously calculate the Loan-to-Value (LTV) ratios of specific isolated pools, waiting for market volatility to trigger liquidation events.

## Example Agent Workflows
- **Isolated Pool Liquidations**: Wnode monitors an isolated pool containing low-liquidity meme coins. When the LTV threshold is breached, Wnode executes the liquidation. Because DEX liquidity for the asset might be low, Wnode utilizes dynamic slippage algorithms to ensure the 10-20% isolated penalty covers the swap impact.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Enhanced Liquidation Bounties**:
1. **Variable Penalties**: Solend liquidations provide a 5% bonus for main pool assets, but often offer up to 20% bonuses on highly volatile isolated pool assets. Wnode captures this spread.

## Activation Steps
1. Connect to the Solana network.
2. Whitelist specific Solend Isolated Pool addresses in the Wnode configuration.
3. Set `ENABLE_SOLEND_LIQUIDATOR=true`.

## Limitations
- Liquidation of highly volatile assets carries significant "toxic flow" risk. If the asset crashes 50% in a single block, Wnode might not be able to swap the seized collateral fast enough to cover the debt repayment, resulting in a loss.

## Future Upgrade Path
- Integration with Solend's new Margin Trading features to automate decentralized short-selling of overvalued Solana tokens directly from the lending pools.
