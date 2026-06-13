# Yearn Finance Integration Overview

## What is Yearn Finance?
Yearn is a decentralized suite of products providing yield generation, lending aggregation, and more. Its core products are Vaults (yVaults), which pool capital and automatically execute yield-farming strategies across DeFi to socialize gas costs and maximize returns.

## Why Wnode Integrates with Yearn
Yearn relies on decentralized **Keepers** to call the `harvest()` function on its strategies. By integrating with Yearn, Wnode operators can act as Keepers, executing these critical compounding transactions in exchange for bounties.

## How Wnode Interacts with Yearn
The Wnode agent monitors the `BaseStrategy` contracts for active Yearn Vaults. It calculates the accrued yield vs. the current ETH gas price. If calling `harvest()` is profitable, Wnode submits the transaction to the network.

## Example Agent Workflows
- **Vault Harvesting**: Continuously polling the `harvestTrigger()` view function. If true, Wnode automatically executes `harvest()`, compounding the strategy's yield.
- **Tend Execution**: Calling `tend()` on strategies that require periodic maintenance (e.g., maintaining collateral ratios) without full compounding.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Harvest Bounties**:
1. **Execution Profit**: Yearn reimburses the gas cost of the `harvest()` transaction and pays an additional premium (often a percentage of the yield generated) to the Keeper executing the call.

## Activation Steps
1. Register the Wnode agent as a recognized Keeper (if required by specific V2/V3 strategies) or participate via permissionless Keep3r networks.
2. Configure an Ethereum RPC and fund the execution wallet.
3. Set `ENABLE_YEARN_HARVESTER=true`.

## Limitations
- Flashbots and MEV searchers heavily compete for `harvest()` calls on Ethereum Mainnet. Wnode must utilize MEV relays to avoid reverted transactions and wasted gas.

## Future Upgrade Path
- Native integration with the **Keep3r Network** to seamlessly route Yearn harvest jobs to Wnode operators based on their KP3R bond.
