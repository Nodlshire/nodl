# Wormhole Integration Overview

## What is Wormhole?
Wormhole is a generic cross-chain message passing protocol. It connects over 30 blockchains, enabling the transfer of tokens (Portal) and arbitrary data. It is secured by a decentralized network of 19 "Guardians" who observe and sign cross-chain messages.

## Why Wnode Integrates with Wormhole
While the 19 Guardians sign the messages, **Relayers** are required to actually deliver the signed messages to the destination chain and pay the destination gas fees. Wnode integrates to provide this decentralized relaying infrastructure.

## How Wnode Interacts with Wormhole
Wnode operators run Wormhole Relayer nodes. The agent watches the origin chain for a VAA (Verified Action Approval) signed by the Guardians. Once 13/19 signatures are verified, Wnode takes the VAA and executes the transaction on the destination chain.

## Example Agent Workflows
- **Cross-Chain Relaying**: A user initiates a cross-chain swap from Ethereum to Solana and pays the relayer fee in ETH. The Wnode Relayer monitors the Wormhole network, picks up the VAA, submits it to the Solana Wormhole program, pays the SOL gas, and pockets the ETH fee.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Relayer Margins**:
1. **Execution Spread**: Wnode operators collect the relayer fee paid by the user on the origin chain, generating profit based on the spread between the quoted origin fee and the actual destination execution cost.

## Activation Steps
1. Deploy the Wormhole Relayer client within the Wnode orchestration engine.
2. Fund the relayer wallets on all supported destination chains (Solana, Arbitrum, BSC, Optimism).
3. Set `ENABLE_WORMHOLE_RELAYER=true`.

## Limitations
- Requires maintaining liquid gas tokens across 30+ blockchains.
- Price volatility between origin and destination gas tokens can erode relayer margins if not dynamically hedged.

## Future Upgrade Path
- **Guardian Network Integration**: Ultimately applying to become one of the 19 canonical Wormhole Guardians, running the core consensus verification nodes for the entire cross-chain ecosystem.
