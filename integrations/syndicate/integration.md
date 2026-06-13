# Syndicate (Account Abstraction) Integration Overview

## What is Syndicate?
Syndicate provides scalable transaction broadcasting infrastructure and smart account automation for EVM chains. It heavily supports ERC-4337 (Account Abstraction), providing enterprise-grade APIs for Bundlers and Paymasters.

## Why Wnode Integrates with Syndicate
ERC-4337 networks require "Bundlers" to collect UserOperations (UserOps) from a specialized mempool, bundle them into a single transaction, and submit them to the blockchain. Wnode integrates to provide a decentralized Bundler execution layer, enabling gasless transactions for users.

## How Wnode Interacts with Syndicate
Wnode can utilize Syndicate's APIs for transaction broadcasting or operate a sovereign ERC-4337 Bundler node. Wnode agents listen to the alternate UserOp mempool, validate the smart account signatures, and call the global `EntryPoint` contract to execute the bundle.

## Example Agent Workflows
- **Decentralized Bundling**: Wnode collects 50 user transactions (UserOps) requesting to mint an NFT. Wnode verifies the signatures, packages them into a single Ethereum block, and submits them. The Wnode Paymaster contract automatically sponsors the gas fees for specific verified users.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Bundler MEV and Execution Premiums**:
1. **Priority Fees**: Users attach priority fees to their UserOps. Wnode captures the difference between the sum of the user priority fees and the actual base gas cost of the bundled transaction.
2. **UserOp MEV**: Wnode can optimally order the UserOps within the bundle (e.g., placing a swap before a mint) to extract maximal extractable value directly from the Account Abstraction mempool.

## Activation Steps
1. Deploy an ERC-4337 Bundler node (e.g., Alto or native Wnode bundler) connected to the standard UserOp mempool.
2. Configure Wnode's execution wallet to act as the Bundler.
3. Set `ENABLE_ERC4337_BUNDLER=true`.

## Limitations
- Bundlers must pre-simulate every UserOp to ensure it will not revert on-chain. If a UserOp reverts during the bundled execution, Wnode pays the base layer gas penalty out of pocket.

## Future Upgrade Path
- Native Wnode Paymaster integration, allowing Wnode operators to sponsor gas fees for users interacting specifically with Wnode-deployed smart contracts in exchange for affiliate fees.
