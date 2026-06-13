# MakerDAO (Sky) Integration Overview

## What is MakerDAO?
MakerDAO (now transitioning to the Sky ecosystem) is a decentralized credit platform on Ethereum that issues the DAI stablecoin. Users mint DAI by locking collateral (e.g., ETH, WBTC) in smart contracts called Vaults. The protocol is kept solvent by external Keepers who liquidate undercollateralized Vaults.

## Why Wnode Integrates with MakerDAO
Wnode integrates with MakerDAO's auction systems. By running an automated Maker Keeper, Wnode operators can profit from maintaining the health of the DAI peg, actively hunting and liquidating underwater positions.

## How Wnode Interacts with MakerDAO
Wnode monitors the `vat` contract to track the collateralization ratios (CR) of all open Vaults. When a Vault drops below its specific Liquidation Ratio, Wnode calls `dog.bark(ilk, urn, kpr)` to initiate a liquidation auction, and participates in collateral auctions via the `clip.take()` function.

## Example Agent Workflows
- **Vault Liquidation (Barking)**: The agent scans for vulnerable Vaults. Upon detecting one, it triggers `bark`, forcing the protocol to seize the collateral and start a Dutch auction.
- **Collateral Arbitrage (Taking)**: Wnode monitors active Dutch auctions. When the auction price drops below the external market price (checked via Oracles), Wnode executes `take` using flashloans, instantly selling the seized collateral on Uniswap for an arbitrage profit.

## Revenue Model (Real Incentives)
Wnode generates revenue through **Liquidation Rewards**:
1. **Barking Reward**: The Keeper who successfully triggers `bark` is awarded a fixed flat fee (in DAI) + a percentage of the liquidated collateral (the `chop` penalty).
2. **Dutch Auction Arbitrage**: Keepers acquire collateral at a discount to market value during the `take` phase, netting the spread minus flashloan fees.

## Activation Steps
1. Sync an Ethereum RPC provider.
2. Configure Wnode flashloan routing (e.g., Balancer/Aave flashloans).
3. Set `ENABLE_MAKER_KEEPER=true`.

## Limitations
- Extreme MEV competition. Triggering `bark` and executing `take` on Ethereum Mainnet is completely dominated by MEV searchers using private flashbots relays.
- Requires complex smart contract integrations to atomically bundle the flashloan, `take`, and DEX swap in a single transaction.

## Future Upgrade Path
- Expanding the integration to support the Dai Savings Rate (DSR) router for idle stablecoin yield.
- Adapting the Keeper architecture to natively support the new Sky Protocol parameters and SubDAOs.
