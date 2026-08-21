# System Architecture & Building Blocks

**Version**: 1.7  
**Specification Standard**: arc42 Architectural Blueprint  

---

## 1. System Context & Boundaries

The Wnode Sovereign Compute Mesh connects three primary actor classes:

1. **Compute Buyers & Autonomous Agents**: Issue workloads via USD-based API requests.
2. **Node Operators**: Supply heterogeneous hardware (Desktop, Server, DeWi Radio, LEO Satellite) running `nodld`.
3. **Protocol Stewards**: Oversee constitutional parameter updates and security emergency pauses via Soul-DAO governance.

---

## 2. Core Building Blocks

### A. Telemetry Engine (`nodld/internal/api/server.go`)
Handles incoming node heartbeats (`/api/v1/nodes/heartbeat`), batch heartbeat ingestion (`/api/v1/nodes/heartbeat/batch`), and token registration (`/api/v1/nodes/headless-token/consume`).

### B. State Storage & BBolt Database (`nodld/internal/account/store.go`)
Employs an atomic transactional BBolt database (`state/engine.db`) for user accounts, CRM records, and staking ledgers, combined with atomic temporary file writes (`state/engine.json.tmp` -> `state/engine.json`) for node fleet state.

### C. RAM Execution Fabric (`nodld/internal/account/model.go`)
Isolates execution contexts inside ephemeral `tmpfs` RAM namespaces, enforcing zero persistent disk storage and instant zero-wiping (`explicit_bzero`) upon completion.
