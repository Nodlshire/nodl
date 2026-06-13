# Debug & Observability

To maintain operational visibility over a distributed Mesh network, the control plane exposes a suite of local HTTP endpoints. These endpoints bypass authentication explicitly because they are bound strictly to `127.0.0.1:3037` and are designed solely for local developer diagnostics and internal metrics scraping.

## Billing Observability

These endpoints query the `BillingEngine` to inspect customer states.

- **`GET /debug/billing/modes`**
  - **Scope**: Returns the active billing mode for every customer that has submitted a task since server boot.
  - **Output**: JSON map indicating `prepaid` or `postpaid` mapping to each `customer_id`.

- **`GET /debug/billing/balances`**
  - **Scope**: Queries only the subset of customers utilizing the `prepaid` mode.
  - **Output**: JSON map of `customer_id` strictly linked to their current available USD float.

- **`GET /debug/billing/invoices`**
  - **Scope**: Queries only the subset of customers utilizing the `postpaid` corporate mode.
  - **Output**: JSON payload summarizing the all-time `TotalWU` consumed and the final `TotalUSD` liability.

## Payout Observability

These endpoints interrogate the state of the Stripe Connect transfer loops inside the `PayoutEngine`.

- **`GET /debug/payouts/earnings`**
  - **Scope**: Exposes the internal Stripe ledger tracking pending balances.
  - **Output**: Detailed JSON objects returning exactly how much an operator has ever earned, how much has been actively pushed to their bank, and what fractional amount currently sits in `pending`.

- **`GET /debug/payouts/history`**
  - **Scope**: Reads the immutable slice of `PayoutRecord` structs.
  - **Output**: JSON array of UUID-tracked transaction attempts. Identifies explicitly if a transfer `failed` and reveals the exact `error_msg` returned by the Stripe SDK.

## Mesh & Topology Observability

These endpoints track the physical hardware and connectivity state of the node fleet.

- **`GET /debug/nodes`**
  - **Scope**: Queries the internal WebSocket `NodeRegistry`.
  - **Output**: Spits out active connections, their physical capabilities (e.g. CPU core count, WASM support flags), and their active Tier string (`Standard`, `Ultra`, etc.).

- **`GET /debug/reputation`**
  - **Scope**: Interrogates the memory footprint of the `ReputationLedger`.
  - **Output**: Key-value map displaying every node's reputation score (0-100 scale). Essential for diagnosing why a node is not receiving shards (if reputation is below 20).

- **`GET /debug/economics`**
  - **Scope**: Triggers an immediate compile of the `ExportEconomics` struct.
  - **Output**: Deep JSON mapping uniting nodes, operators, rewards, and tier assignments into a single master payload.

- **`GET /debug/crm-sync`**
  - **Scope**: Diagnoses the health of the 10-minute CRM HTTP push cycle.
  - **Output**: Shows internal buffer counts (queue lengths). If the CRM goes offline, this endpoint will reveal `last_error` and the size of the backlog safely contained within the mesh.
