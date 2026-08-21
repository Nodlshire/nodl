# Wnode — Architecture

## System Components

### 1. Node Operator (nodld)
- Written in Go.
- Runs on end-user devices.
- Connects to the mesh via libp2p.
- Contributes spare CPU/GPU when idle.

### 2. Mesh Service (apps/mesh)
- TypeScript backend service.
- Handles task distribution, ledger, and event tracking.
- SQLite-based ledger for compute accounting.

### 3. Command Dashboard (apps/command)
- Next.js web application.
- Operator management, mesh insights, alerts, and governance.
- Connects to mesh service and nodld APIs.

### 4. Public Website (apps/web)
- Next.js marketing and governance portal.
- Includes founder's note, governance pages, and pricing.

### 5. AI Seed (ai/)
- Lightweight local AI presence.
- Reads project documentation (.md files).
- Provides insights via CPU-only inference.
- Displayed in the Command Dashboard.

### 6. DAO Contracts (DAO/)
- Solidity smart contracts (Foundry project).
- WnodeGovernor and WnodeTimelock for on-chain governance.
- Built with OpenZeppelin Contracts v5.6.1.

## Data Flow

```
Devices → nodld → libp2p mesh → Mesh Service → Command Dashboard
                                                       ↓
                                                   AI Seed (insights)
```
