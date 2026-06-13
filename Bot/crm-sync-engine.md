# CRM Sync Engine

The CRM Sync Engine operates as an asynchronous, decoupling layer between the high-throughput Mesh router and the external Customer Relationship Management (CRM) / CMD API. It aggregates operator performance and customer billing data, guaranteeing eventual consistency.

## 1. 10-Minute Sync Cycle

To optimize network utilization and prevent API throttling against the CRM, the Sync Engine does not push data on every task completion.
Instead, the `SyncEngine` (`core/crmsync/sync.go`) utilizes a non-blocking background goroutine governed by a strictly timed 10-minute ticker.
- When the ticker fires, the system evaluates internal callbacks (`FetchAll` and `FetchBilling`) to snapshot the current state of the mesh.

## 2. Billing Sync

The engine queries the `BillingEngine` to fetch a slice of `CustomerAggregate` structs. 
- These structures encapsulate `TotalWU`, `TotalUSD`, and current `BalanceUSD` per customer.
- The aggregates are pushed via a dedicated retry channel (`billingQueue`).
- The `CRMClient` executes a `POST` request to `/api/customers/billing` on the remote CRM server, updating the end-user's live dashboard with their current consumption.

## 3. Operator Payout & Economic Sync

Simultaneously, the engine queries the global `Server` to generate `OperatorEconomicProfile` snapshots for all registered operators.
- These profiles encompass Node counts, Total WU produced, Total USD generated, and aggregate Reputation.
- The data is enqueued into a primary `queue` channel.
- The `CRMClient` pushes this slice iteratively to `/api/operators/economics`, maintaining the CRM as the visual Source of Truth for node operators checking their active metrics.

## 4. CRM API Contract

The `CRMClient` wraps standard HTTP protocols to communicate securely with the CMD portal.
- Authentication: Securely injects a `Bearer` token via the `Authorization` header (`APIKey`).
- Content-Type: Strictly defined as `application/json`.
- Routes: Targets predictable endpoints built explicitly to ingest these aggregates.
- Error Code Evaluation: Any response $\ge 400$ is flagged as a direct communication failure.

## 5. Retry Behavior & Error Handling

To maximize network resilience, the Sync Engine handles transient failures gracefully:
- **Internal Queues**: The `queue` and `billingQueue` are highly buffered (capacity of 1000 items) to withstand heavy load without blocking the mesh execution cycle.
- **Drain and Retry**: If an HTTP push to the CRM fails (due to network outage or a 500 status), the engine logs the failure and safely *re-enqueues* the exact profile back into the buffer.
- During the next 10-minute cycle, the engine attempts to drain the queue again. This guarantees that metrics generated during a CRM downtime event are buffered in-memory and subsequently restored when the connection recovers.
