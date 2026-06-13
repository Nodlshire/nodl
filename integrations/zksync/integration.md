# zkSync Era Integration Overview

## What is zkSync Era?
zkSync Era is a leading ZK-Rollup Layer 2 on Ethereum. Its defining architectural feature is **Native Account Abstraction (AA)**. Unlike other EVM chains that require a separate ERC-4337 mempool and bundlers, zkSync implements AA at the protocol level, making smart accounts native to the L2.

## Why Wnode Integrates with zkSync Era
Because Account Abstraction is native, deploying custom **Paymaster** contracts is significantly more efficient. Wnode integrates to act as a custom Paymaster network, allowing users to pay gas in any ERC-20 token, while Wnode extracts an exchange fee.

## How Wnode Interacts with zkSync Era
Wnode deploys specialized Paymaster smart contracts to the zkSync L2. When a user executes a transaction on zkSync, they request Wnode to sponsor the ETH gas fee. The Wnode Paymaster validates the transaction and takes an equivalent amount of USDC (plus a spread) directly from the user's smart account.

## Example Agent Workflows
- **Gas Sponsorship & Swapping**: A user wants to swap PEPE for USDC on SyncSwap but has zero ETH for gas. They send the transaction through the Wnode Paymaster. Wnode pays the 0.0001 ETH network fee and automatically deducts $0.40 worth of USDC from the user's balance, capturing a 5% margin on the gas exchange.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Paymaster Spreads**:
1. **Gas Arbitrage**: Charging users a slight premium (in alternative ERC-20 tokens) for the convenience of paying their native ETH gas fees seamlessly.

## Activation Steps
1. Deploy the Wnode Paymaster contract to zkSync Era.
2. Fund the Paymaster contract with native ETH to sponsor user transactions.
3. Set `ENABLE_ZKSYNC_PAYMASTER=true`.

## Limitations
- Paymasters must be highly resilient against griefing attacks. If a user transaction fails during execution, the Paymaster still pays the base ETH gas fee. Wnode's off-chain simulation engine must strictly vet all UserOps before approval.

## Future Upgrade Path
- Deploying a Wnode Hyperchain (a custom L3 built on top of zkSync's ZK-Stack) dedicated entirely to executing Wnode's high-frequency trading and liquidation logic with customized, near-zero gas costs.
