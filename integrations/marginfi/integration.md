# MarginFi Integration Overview

## What is MarginFi?
MarginFi is a decentralized portfolio margin protocol on Solana. It acts as a massive money market allowing users to borrow across isolated and global asset pools. It utilizes a unified risk engine to manage cross-collateralized positions.

## Why Wnode Integrates with MarginFi
To protect its lenders, MarginFi relies heavily on ultra-fast third-party liquidators. Wnode integrates with MarginFi to provide elite liquidation infrastructure, leveraging its high-speed RPC mesh to secure the protocol and generate profit.

## How Wnode Interacts with MarginFi
Wnode utilizes the MarginFi TypeScript SDK and directly monitors the global account states of all borrowers on-chain. When a borrower's account health hits 0% (or dropping below maintenance margin), Wnode executes the liquidation instruction.

## Example Agent Workflows
- **Flash-Liquidator**: Wnode identifies a MarginFi account with a health factor < 0%. Wnode instantly requests a flash loan from Solend or uncollateralized Jupiter flash liquidity, repays the debt in MarginFi, seizes the collateral (e.g., BONK), swaps it back to USDC on Jupiter, and repays the flash loan, pocketing the bonus.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Liquidation Bonuses**:
1. **5% Penalty Capture**: MarginFi applies a flat 5% liquidation penalty to underwater accounts. Wnode captures this full 5% spread minus the execution slippage and Solana network fees.

## Activation Steps
1. Provision a dedicated, bare-metal Solana RPC to minimize block discovery latency.
2. Configure Wnode's flash loan routing program.
3. Set `ENABLE_MARGINFI_LIQUIDATOR=true`.

## Limitations
- Extreme network latency competition. Liquidations on Solana are dominated by specialized Jito MEV searchers. Wnode must use Jito bundle submissions to guarantee transaction atomicity and front-run competing bots.

## Future Upgrade Path
- Flash-borrowing from Wnode's own decentralized treasury rather than relying on external flash loans, eliminating external fee dependencies and maximizing liquidation margins.
