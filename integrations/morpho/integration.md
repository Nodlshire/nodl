# Morpho Blue Integration Overview

## What is Morpho Blue?
Morpho Blue is a highly efficient, permissionless, and immutable lending protocol. Unlike monolithic lending pools (Aave/Compound), Morpho Blue isolates risk by creating independent markets consisting of one collateral asset, one loan asset, one oracle, and one Interest Rate Model (IRM).

## Why Wnode Integrates with Morpho Blue
Because Morpho Blue markets are completely isolated, liquidations are highly fragmented. Wnode integrates to provide a wide-net liquidation execution layer across hundreds of custom isolated markets, capitalizing on lucrative and less-competitive liquidation bonuses.

## How Wnode Interacts with Morpho Blue
Wnode interfaces with the core `Morpho` contract. The agent monitors the collateralization ratio (LTV) of borrowers across all active isolated `Id` markets. When a borrower breaches the maximum LTV, Wnode executes the `liquidate` function.

## Example Agent Workflows
- **Isolated Market Liquidator**: Wnode tracks a high-risk meme-coin/USDC isolated market. When the meme-coin oracle price drops, Wnode uses a flashloan to repay the borrower's USDC debt, seizes the meme-coin collateral at a discount, and swaps it to capture the spread.
- **MetaMorpho Rebalancer**: Wnode automates the re-allocation of liquidity across Morpho Blue markets for MetaMorpho Vaults to optimize yield.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Liquidation Spreads & Performance Fees**:
1. **Liquidation Bonus**: Retaining the spread between the seized collateral value and the debt repaid (minus flashloan and DEX swap fees).
2. **Vault Management**: Earning performance fees by actively managing MetaMorpho vault allocations.

## Activation Steps
1. Connect to an Ethereum or Base RPC.
2. Configure the specific Morpho `marketId` hex strings the agent should monitor.
3. Set `ENABLE_MORPHO_LIQUIDATOR=true`.

## Limitations
- Isolated markets may lack sufficient DEX liquidity for the seized collateral, meaning flashloan atomic swaps could fail due to high slippage. The Wnode agent must simulate the DEX swap liquidity off-chain before executing.

## Future Upgrade Path
- Native integration with the Ethena (USDe) Morpho markets to automate advanced basis-trade looping strategies.
