# Ether.fi Integration Overview

## What is Ether.fi?
Ether.fi is a decentralized Liquid Restaking Protocol (eETH). Its core differentiator is that stakers retain control of their validator keys. Ether.fi utilizes "Operation Solo Staker" and DVT to distribute validating duties to independent node operators worldwide.

## Why Wnode Integrates with Ether.fi
Wnode's decentralized hardware mesh is the exact infrastructure Ether.fi needs for its solo staker initiative. Integrating allows Wnode operators to run Ethereum validators for Ether.fi without requiring 32 ETH upfront.

## How Wnode Interacts with Ether.fi
Wnode orchestrates the deployment of Ether.fi's DVT keys (via SSV or Obol). The agent connects to the `LiquidityPool` contract to verify delegations and automatically configures the consensus client to propose blocks for the Ether.fi network.

## Example Agent Workflows
- **Solo Staker Node Provisioning**: Wnode detects an assigned Ether.fi validator via the DVT registry. It automatically spins up the required Ethereum execution/consensus clients, decrypts the KeyShare, and begins attesting to the network.
- **eETH Yield Farming**: Wnode automates the deposit of user ETH into the `LiquidityPool`, mints eETH, and wraps it into weETH for deployment in DeFi lending protocols (e.g., Morpho or Aave).

## Revenue Model (Real Incentives)
Wnode generates revenue via **Solo Staker Commissions**:
1. **Validator Commission**: Wnode operators receive a dedicated cut of the ETH consensus and execution layer rewards for running the Ether.fi DVT node.
2. **Yield Loop Fees**: Charging a performance fee for managing highly leveraged eETH recursive borrowing loops in DeFi.

## Activation Steps
1. Apply as a Node Operator through the Ether.fi Operation Solo Staker program.
2. Configure Wnode hardware to meet Ethereum validator specifications.
3. Set `ENABLE_ETHERFI_NODE=true`.

## Limitations
- Running Ethereum validators requires 24/7 uptime and massive unmetered bandwidth. Missing attestations directly penalizes the operator's reputation and commission.

## Future Upgrade Path
- Integration with Ether.fi's `Cash` product to allow Wnode operators to seamlessly off-ramp earned staking commissions directly to physical credit cards via smart contract abstraction.
