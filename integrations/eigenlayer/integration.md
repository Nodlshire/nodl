# EigenLayer Integration Overview

## What is EigenLayer?
EigenLayer is a protocol built on Ethereum that introduces "restaking". It allows Ethereum validators or liquid staking token (LST) holders to repurpose their staked ETH to secure secondary networks, data availability layers, and oracle systems known as Actively Validated Services (AVSs).

## Why Wnode Integrates with EigenLayer
Wnode integrates with EigenLayer to act as a professional **Operator**. By allowing end-users to delegate their restaked ETH to Wnode, the mesh can secure multiple AVSs simultaneously, generating massive aggregate yield while distributing compute loads across Wnode hardware.

## How Wnode Interacts with EigenLayer
Wnode connects to the core `DelegationManager` and `StrategyManager` smart contracts on Ethereum. When an operator opts-in to an AVS, Wnode deploys the specific AVS client software (e.g., EigenDA, Lagrange, or AltLayer clients) as containerized workloads via the Wnode orchestration engine.

## Example Agent Workflows
- **AVS Deployment**: When an operator opts into the EigenDA AVS, Wnode automatically spins up the EigenDA dispersive node container, syncs the necessary keys, and begins validating data blobs.
- **Reward Sweeping**: Wnode automatically claims AVS token emissions and restaking rewards distributed to the operator address.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Operator Commissions**:
1. **AVS Yield**: AVS networks pay operators and delegators for cryptoeconomic security. This is paid in native AVS tokens, ETH, or EIGEN.
2. **Commission Rate**: Wnode operators set a commission fee (e.g., 5-10%) on the yield generated for delegated restakers.

## Activation Steps
1. Register the Wnode identity via the `DelegationManager.registerAsOperator()` contract call.
2. Configure Wnode hardware to allocate CPU/RAM for incoming AVS containers.
3. Set `ENABLE_EIGENLAYER_OPERATOR=true`.

## Limitations
- **Slashing Risk**: If Wnode hardware fails, goes offline, or computes invalid state for an AVS, the delegated restaked ETH is subject to slashing conditions enforced by EigenLayer.
- **Hardware Intensity**: Running multiple AVSs simultaneously requires enterprise-grade hardware bandwidth and compute.

## Future Upgrade Path
- Integrating an automated risk-matrix agent that dynamically opts in and out of AVSs based on the yield-to-slashing-risk ratio.
