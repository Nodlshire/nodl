# Kelp DAO Integration Overview

## What is Kelp DAO?
Kelp DAO is a Liquid Restaking protocol that issues the rsETH token. It accepts native ETH as well as existing Liquid Staking Tokens (LSTs like stETH, ETHx, and sfrxETH) and deploys them into EigenLayer to farm AVS rewards and Kelp Miles (points).

## Why Wnode Integrates with Kelp DAO
Because Kelp accepts various underlying LSTs, the rsETH peg dynamics can fluctuate based on the liquidity of the underlying assets. Wnode integrates to automate peg arbitrage, compounding, and LST conversion loops.

## How Wnode Interacts with Kelp DAO
Wnode interfaces with the `LRTDepositPool` contract. It monitors the secondary DEX pricing of rsETH versus its net asset value (NAV) driven by the basket of underlying LSTs. 

## Example Agent Workflows
- **rsETH Peg Arbitrage**: If rsETH trades at a 2% discount on Balancer, Wnode automatically buys rsETH on the open market. When withdrawals are enabled (or the peg restores), the agent redeems the rsETH for the underlying LSTs, capturing the 2% spread risk-free.
- **Automated Restaking**: Moving idle LSTs from user wallets into Kelp DAO to maximize capital efficiency via EigenLayer points.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Arbitrage and Auto-Farming Fees**:
1. **Peg Arbitrage**: Extracting direct ETH profit from market inefficiencies in the rsETH token.
2. **Performance Fees**: Taking a cut of the Kelp Miles / AVS token airdrops generated for Wnode users through automated portfolio routing.

## Activation Steps
1. Connect an Ethereum RPC.
2. Fund the execution wallet with WETH/stETH for arbitrage routing.
3. Set `ENABLE_KELP_ARBITRAGE=true`.

## Limitations
- EigenLayer point valuations are highly speculative prior to TGE. Wnode must rely on OTC markets (Whales Market) to price the true APY of restaking loops accurately.

## Future Upgrade Path
- Cross-chain Kelp automation: Utilizing native LayerZero integrations to bridge rsETH to Arbitrum/Optimism for higher DEX LP yields while maintaining mainnet points generation.
