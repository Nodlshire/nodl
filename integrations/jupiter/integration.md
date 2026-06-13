# Jupiter Integration Overview

## What is Jupiter?
Jupiter is the leading decentralized exchange (DEX) aggregator on the Solana blockchain. Beyond basic swaps, Jupiter offers Limit Orders, Dollar Cost Averaging (DCA), and Jupiter Perps (a GMX-style perpetual exchange).

## Why Wnode Integrates with Jupiter
Jupiter's advanced features—specifically DCA and Limit Orders—are not smart-contract auto-executing; they require external "Crankers" (Keepers) to execute the trades when conditions are met. Wnode integrates to provide this decentralized cranking infrastructure.

## How Wnode Interacts with Jupiter
Wnode connects to the Solana blockchain and utilizes the Jupiter Keeper SDK. It monitors the on-chain state of Jupiter Limit Order and DCA programs. When an order is mathematically actionable, Wnode fires the execution instruction.

## Example Agent Workflows
- **DCA Cranking**: A user sets up a DCA to buy $100 of SOL every day. Wnode monitors the exact timestamp. At the exact second the DCA is valid, Wnode cranks the Jupiter program, executing the swap on behalf of the user.
- **Limit Order Execution**: Continuously evaluating open Jupiter Limit Orders against the current aggregated DEX prices. If the limit price is hit, Wnode executes the trade.

## Revenue Model (Real Incentives)
Wnode generates revenue via **Crank Bounties**:
1. **Execution Refunds**: Jupiter compensates Crankers with the SOL gas cost plus a flat execution bounty or a percentage of the traded amount for providing the decentralized execution service.

## Activation Steps
1. Connect to a high-throughput Solana RPC.
2. Load the execution keypair with sufficient SOL to cover high-frequency base transaction fees.
3. Set `ENABLE_JUPITER_CRANK=true`.

## Limitations
- The Solana network is prone to high congestion during volatile events. Wnode's Keeper logic must intelligently backoff or increase priority fees (Compute Unit pricing) dynamically to ensure successful cranking without burning excessive SOL.

## Future Upgrade Path
- JLP Auto-Compounding: Wnode agents managing positions in the Jupiter Liquidity Provider (JLP) pool, automatically hedging delta exposure on external perp DEXes while harvesting JLP fee yields.
