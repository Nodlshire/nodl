# Pyth Network Integration Overview

## What is Pyth Network?
Pyth is a high-frequency, decentralized financial oracle network. Unlike Chainlink's traditional "push" model, Pyth utilizes a "pull" oracle model. Prices are continuously updated on Pythnet (a Solana application chain), and users/dApps must explicitly "pull" (or crank) the price onto the target blockchain when needed.

## Why Wnode Integrates with Pyth
Because Pyth requires active execution to update prices on target chains (like Arbitrum, Optimism, Base), it relies on external keepers. Wnode integrates to provide automated Price Updaters, ensuring DeFi protocols have fresh oracle data.

## How Wnode Interacts with Pyth
Wnode interfaces with the Hermes API (Pyth's off-chain price repository) and target EVM `PythUpdatable` contracts. When a DeFi protocol requires a fresh price to execute a liquidation or trade, Wnode fetches the signed VAA from Hermes and submits it on-chain.

## Example Agent Workflows
- **Price Pulling & Liquidation**: Wnode tracks a Synthetix perp position. When the price of ETH drops, Wnode realizes the position is underwater based on Hermes off-chain data. Wnode pulls the Pyth price on-chain and executes the liquidation in the exact same transaction, guaranteeing execution and securing the bounty.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Batched Execution Bounties**:
1. **MEV Liquidation Combinations**: Pulling Pyth prices generates no direct revenue by itself. Wnode monetizes this by atomically bundling the Pyth price update with a highly profitable liquidation or limit order execution on protocols like Synthetix or GMX.

## Activation Steps
1. Connect to the Hermes WebSockets API for real-time Pyth price streams.
2. Connect Wnode to the target execution networks (Arbitrum, Base, Optimism).
3. Set `ENABLE_PYTH_UPDATER=true`.

## Limitations
- The cost of updating Pyth prices on-chain requires base layer gas. If the bundled liquidation or trade reverts, Wnode absorbs the gas loss.

## Future Upgrade Path
- **Pyth Data Provider**: Leveraging Wnode's decentralized mesh to act as a primary Data Provider to Pythnet, sourcing institutional off-chain data and earning Pyth protocol rewards for accurate reporting.
