# M2M Payments

Machine-to-Machine (M2M) payments form the financial lifeblood of the Wnode compute mesh, enabling hardware and software to transact autonomously.

## The Settlement Layer: Tether (USDT)
Wnode relies on Tether (USDT) as the primary fiat-backed stablecoin for high-frequency M2M workflows.

- **High-Frequency Execution**: Utilizing Tron, Base, and Polygon, Wnode agents execute micro-transactions with minimal gas overhead.
- **Cross-Border Automation**: USDT enables instant, permissionless cross-border settlement for distributed hardware fleets.
- **Compliance & Safety**: Automated onchain checks ensure that M2M flows respect regulatory constraints, including KYC/KYB limits, blacklisting parameters, and sanction enforcements.
- **AI & DePIN**: Custom RPC adapters and SDK wrappers allow AI agents and DePIN devices to programmatically trigger USDT transfers upon verifiable task completion.

## Gas-Free Execution Engine: ICP
For massive-scale, high-frequency M2M pipelines, Wnode deploys the Internet Computer (ICP) execution engine.
- **Reverse-Gas Model**: ICP canisters are pre-funded with Cycles (pegged to XDR), ensuring that the end-user or machine agent pays zero fluctuating gas fees.
- **Sub-Second Finality**: M2M clearance happens at sub-second subnet consensus speeds.
- **Autonomous Triggers**: Utilizing HTTPS Outcalls, M2M ledgers can query external real-world APIs to trigger deterministic payments across hardware networks natively.

## Streaming M2M State Channels: Cardano Hydra
To support streaming micro-payments for autonomous devices, Wnode integrates Cardano's Hydra L2 scaling solution.
- **Isomorphic State Channels**: Hydra provides sub-second finality and near-zero fees by running parallel EUTXO ledger instances off-chain.
- **Batch Processing**: For L1 settlement, thousands of machine payouts can be bundled into a single predictable-fee transaction using the UTXO model.
- **Edge Device Verification**: Hardware devices utilize Mithril light clients to independently verify incoming payments mathematically without heavy indexing requirements.
