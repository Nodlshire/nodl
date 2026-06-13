# CMD → Mesh → CRM Data Flow

The following details the full architectural data flow representing the lifecycle of a task moving from client submission (CMD) through to the distributed worker nodes (Mesh) and ultimately pushing economic aggregates backward to the visualization dashboard (CRM).

## Pipeline Execution Trace

1. **CMD Task Submission**: A client program (or developer script) submits a task payload natively to the Mesh. The payload includes a unique `task_id` and the associated `customer_id`.
2. **Mesh Validation**: The Mesh Router enqueues the task in the `Scheduler` and securely buffers the `customer_id`.
3. **Execution Routing**: The Mesh dispatches the job to the most highly qualified, reputable operator via WebSocket.
4. **Execution & Return**: The hardware node processes the payload, wraps the output into a `TaskResultPayload`, and pushes it back up the socket.
5. **Billing Trigger**: The Mesh Router computes the exact USD cost. It directly calls the in-memory `BillingEngine` to either deduct the prepaid balance or write an invoice line for postpaid accounts.
6. **Payout Ledger Trigger**: The Mesh simultaneously credits the assigned operator's total all-time rewards, adjusting their payout tracking state.
7. **CRM Sync (Every 10 Mins)**: The non-blocking background loop sweeps both the `BillingEngine` and `PayoutEngine` ledgers, condensing raw database records into single struct `Aggregates`.
8. **Operator / Customer Visibility**: The CRM Sync Engine pushes these aggregated payloads to `/api/operators/economics` and `/api/customers/billing`. The CMD databases update, meaning the next time a user opens the dashboard, they view a completely accurate snapshot.

## Architecture Diagram

```mermaid
flowchart TD
    subgraph Client Space
        A[CMD Dashboard]
        B[API User Script]
    end

    subgraph Mesh Control Plane (node-operator)
        C[Task Router]
        D[Scheduler]
        E[Billing Engine]
        F[Payout Engine]
        G[CRM Sync Engine]
    end

    subgraph Hardware Space
        H[Operator Node 1 (Ultra Tier)]
        I[Operator Node 2 (Standard Tier)]
    end

    subgraph External Platforms
        J[Stripe API]
        K[CMD / CRM Database]
    end

    %% Execution Flow
    A -.->|task_request| C
    B -.->|task_request| C
    C -->|enqueue| D
    D -->|dispatch ws| H
    H -->|task_result| C
    
    %% Financial Triggers
    C -->|deduct USD| E
    C -->|credit WU| F
    
    %% Stripe and CRM Output
    F -->|Process Transfer| J
    E -.->|FetchBilling| G
    F -.->|FetchAll Operators| G
    
    G -->|POST /api/operators| K
    G -->|POST /api/customers| K
```

## Resilience and Isolation

This specific flow ensures that **no critical secrets** and **no direct database credentials** are passed to the operator nodes. The operators act entirely as blind compute endpoints. All financial processing, reputation modification, and database logic are executed by the central Mesh Control Plane (Go backend), adhering tightly to a Zero-Trust topology.
