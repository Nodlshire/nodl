# Cross-Chain Routing

To maintain a frictionless sovereign compute mesh, Wnode implements advanced cross-chain routing capabilities.

## Tether Interoperability
Wnode treats USDT as a unified asset across fragmented ecosystems (Ethereum, Tron, Base, Polygon).

- **Bridging Mechanisms**: Wnode integrates official Tether-supported bridging mechanisms to ensure the safe transit of liquidity.
- **Execution Models**: Agents utilize burn/mint architectures and custodial routing to rebalance USDT across networks dynamically.
- **Risk Mitigation**: By standardizing the RPC surface across networks, Wnode protects against chain-specific risks while maintaining high liquidity availability for M2M payments.

## Bridgeless Interoperability (ICP)
Wnode augments traditional routing by integrating the Internet Computer's (ICP) native cross-chain capabilities.
- **Threshold ECDSA/Schnorr**: ICP canisters act as non-custodial smart contracts, natively signing and holding keys for foreign chains (e.g., Ethereum, Bitcoin).
- **Twin Tokens**: Wnode leverages native cryptographic twins like `ckBTC` and `ckETH` to execute rapid, 1:1 backed swaps within ICP's sub-second consensus environment.
- **Decentralized Oracles**: By invoking consensus-validated HTTPS outcalls, ICP canisters orchestrate multi-chain settlement actions deterministically without relying on third-party bridge protocols.
