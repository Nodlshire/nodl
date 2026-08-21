# Mesh Architecture

The Mesh subsystem acts as the central orchestrator of the Wnode distributed network. It acts as a bidirectional WebSocket router connecting independent operator nodes with the internal workload engines, billing systems, and CRM integrations.

## 1. Task Router Architecture

The central task router (`mesh/router.go`) receives structured JSON messages (`MeshMessage`) over WebSockets from operator nodes. It evaluates the `Type` field to demultiplex the payload into distinct internal handlers:

- `announce`: Handled by `handleAnnounce`, initializes the node connection, computes the hardware capability score, and classifies the node into a tier.
- `heartbeat`: Handled by `handleHeartbeat`, logs uptime, updates dynamic metrics, triggers fraud heuristics, and maintains tier stability.
- `task_request`: Handled by `handleTaskRequest`, accepts a job submission from the CRM/CMD interface, tags it with a CustomerID into the `TaskCustomers` buffer, and enqueues it.
- `task_result`: Handled by `handleTaskResult`, processes completed execution data, updates reputation, computes Work Units (WU), triggers billing, credits the operator ledger, and automatically attempts to assign the next pending task.

## 2. Task Lifecycle (Submit → Shard → Execute → Result)

The lifecycle of a task flows synchronously through the Mesh:

1. **Submit**: A task is submitted (via internal API or CMD) and enters the `Scheduler` queue. The customer ID is buffered in the `taskCustomers` map.
2. **Shard/Distribution**: The `TryAssignPending()` loop continuously attempts to dequeue tasks. The `SelectNode` algorithm ranks connected, idle nodes based on tier capability, reputation score, and hardware.
3. **Execute**: The `Server` issues a `task_request` to the selected node's WebSocket connection and marks the task as *in-flight*.
4. **Result**: The node executes the workload (Native or WASM) and replies with a `task_result`. The router processes the output, applies reputation modifiers (e.g. deductions for failure or zero-WU), and settles the financial transaction via the Billing and Payout engines.

## 3. Shard Distribution Logic

When a large job is divided into shards, the `Scheduler` orchestrates distribution. 
- **Reputation-Weighted Selection**: Nodes with high reputation ($>80$) receive preference during task assignments. Nodes with poor reputation ($<20$) are temporarily blacklisted from assignments to prevent network degradation.
- **Node Eligibility**: The scheduler ensures the selected node has sufficient hardware capabilities (RAM, CPU Cores, WASM support) matching the `ResourceRequirements` of the shard.

## 4. Operator Node Registration

When a node first connects, it sends an `announce` payload.
- The `NodeRegistry` maps the WebSocket connection to the specific `NodeID`.
- Initial metrics (CPU, IO, RAM, GPU, TEE) are passed through `ComputeTierScore` and `ClassifyTier`.
- The node is permanently classified into a compute tier (`Tiny`, `Standard`, `HighRAM`, `Boost`, `Ultra`, `DeccTEE`), which dictates its payout rate.

## 5. Operator Heartbeat Protocol

Nodes must periodically emit a `heartbeat` payload.
- The registry tracks the last seen timestamp to identify dead nodes.
- If rolling metrics (e.g. CPU or RAM load) are included, the `SoftBoundaryEngine` evaluates the data over a moving window to prevent rapid tier flapping.
- **Fraud Detection**: If metric scores suddenly spike or drop by $>50\%$, the node suffers an immediate reputation penalty, preventing malicious operators from artificially boosting payout rates post-registration.

## 6. TaskCustomers Buffer

To maintain stateless WebSocket execution, the Server maintains a `taskCustomers` map (`task_id` $\rightarrow$ `customer_id`). 
When a `task_request` enters the system, the Customer ID is locked into the buffer. When the corresponding `task_result` returns, the Customer ID is retrieved and deleted from the buffer. This ensures the Billing Engine knows exactly which account to charge for the execution without relying on the operator node to securely pass back the customer identity.

## 7. Pricing Matrix Integration

The mesh queries a live `PricingMatrix` which maps `TierID` to `PricePerWU`.
- When a task completes successfully, the router queries the matrix for the node's current tier to calculate the exact `amountUSD`.
- The `PricingMatrix` is refreshed dynamically via a background worker (`StartPricingRefresher`) every 10 minutes to remain synchronized with external market variables.

## 8. Mesh → Billing → Payout → CRM Data Flow

```text
[CMD/User] ---> (Submit Task) ---> [Mesh Router]
                                        |
                                   (Enqueues)
                                        v
                                   [Scheduler] ---> (Assigns) ---> [Operator Node]
                                                                          |
                                                                     (Executes)
                                                                          |
                                   [Mesh Router] <--- (Returns Result) ---+
                                        |
                                        +---> [Billing Engine] (Deducts Prepaid Balance / Invoices Postpaid)
                                        |
                                        +---> [Reward Ledger] (Credits Operator WU)
                                        |
                                        +---> [Payout Engine] (Aggregates Earnings, Creates Stripe Transfer)
                                        |
                                        v
                                 [CRM Sync Engine]
                                        |
                              (Pushes Aggregates via HTTP)
                                        v
                               [Live CRM / CMD DB]
```

## 9. Mesh Debug Endpoints

The Mesh exposes several local HTTP endpoints for real-time observability:

- `GET /debug/nodes`: Lists all connected nodes, their hardware capabilities, and current status.
- `GET /debug/reputation`: Dumps the global reputation ledger, showing the 0-100 score of every node.
- `GET /debug/economics`: Exports the unified economic state, detailing all `NodeEconomicProfile` and `OperatorEconomicProfile` records (tier, total WU, health scores).
- `GET /debug/crm-sync`: Returns the state of the CRM Sync Engine, including queue lengths, last sync times, and latest errors.
