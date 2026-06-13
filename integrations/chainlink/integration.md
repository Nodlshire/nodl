# Chainlink Integration Overview

## What is Chainlink?
Chainlink is a decentralized oracle network and compute platform. It provides off-chain data (Data Feeds), secure verifiable randomness (VRF), cross-chain interoperability (CCIP), and smart contract automation (Chainlink Keepers/Automation).

## Why Wnode Integrates with Chainlink
Wnode integrates with Chainlink to tap into the **Chainlink Automation** network. By acting as a decentralized Keeper, Wnode operators can execute smart contract functions exactly when specific conditions are met, earning protocol-guaranteed bounties in the form of LINK tokens.

## How Wnode Interacts with Chainlink
The Wnode execution engine polls target contracts using the standard `checkUpkeep` function defined in the `AutomationCompatibleInterface`. When the boolean returns true, Wnode automatically submits the `performUpkeep` transaction to the blockchain.

## Example Agent Workflows
- **Limit Order Execution**: Wnode continuously checks DEX limit order contracts and executes them when Chainlink Data Feeds cross the target price.
- **Yield Compounding**: Automatically calling `harvest()` or `compound()` on vault contracts (e.g., Yearn) when the accrued yield outweighs the gas costs.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Automation Premiums**. When a Wnode operator successfully executes a `performUpkeep` transaction, the Chainlink Registry reimburses the exact ETH gas cost *plus* a premium markup (paid in LINK) dynamically adjusted based on network conditions and fast gas prices.

## Activation Steps
1. Register your Wnode operator address in the Chainlink Automation Registry.
2. Set `ENABLE_CHAINLINK_KEEPER=true` in your environment.
3. Provide the node with a funded wallet to cover base execution gas.

## Limitations
- Executing upkeeps on Ethereum Mainnet requires high gas efficiency; Wnode's base automation may be out-competed by hyper-optimized MEV searchers on L1.
- Requires active LINK price tracking to ensure premium payouts cover ETH gas volatility.

## Future Upgrade Path
- Integrating Chainlink **CCIP** to allow Wnode agents to execute cross-chain commands natively.
- Running full OCR (Off-Chain Reporting) oracle nodes to provide proprietary data feeds.
