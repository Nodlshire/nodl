# Multi-Chain Overview

Wnode’s architecture abstracts blockchain complexity, providing a unified sovereign compute mesh capable of seamless cross-chain execution.

## Supported Networks & Rails
Wnode supports execution and settlement across a highly diverse ecosystem, including Ethereum, Tron, Polygon, and Base.

### Multi-Chain Settlement via Tether
To facilitate borderless execution, Wnode leverages Tether (USDT) as the native multi-chain settlement vehicle. 
- **Ethereum & Polygon**: Utilized for deep DeFi integrations and complex smart contract yields.
- **Tron & Base**: Leveraged for ultra-low latency, low-gas M2M micro-payments and high-frequency DePIN settlements.
- **Cross-Chain Flow**: Wnode orchestrates USDT movement seamlessly across these chains using official bridging mechanisms and custodial routing.

### Sovereign Compute Execution via ICP
Wnode incorporates the Internet Computer (ICP) to host full-stack, decentralized applications and persistent autonomous agents.
- **Bridgeless Interoperability**: Utilizing Chain Key Cryptography and threshold signatures, Wnode canisters directly interact with the Bitcoin and Ethereum ledgers without traditional bridges.
- **Zero-Gas M2M**: ICP's reverse-gas model means machine operations consume pre-funded cycles natively, resulting in zero friction for high-frequency user or agent transactions.

### Deterministic Settlement via Cardano
Wnode utilizes Cardano's Extended UTXO (EUTXO) architecture to provide absolute deterministic execution for the compute mesh.
- **Predictable Fees**: Transaction outcomes and execution costs (ExUnits) are calculated locally, ensuring zero slippage and MEV protection.
- **Mithril Proofs**: External systems and sidechains can verify Cardano state through mathematically secure ATMS signatures, avoiding reliance on heavy node infrastructure.
