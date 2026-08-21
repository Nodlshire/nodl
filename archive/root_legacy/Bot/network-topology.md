# Network Topology

## Overview
The wnode network is a globally distributed, locality‑aware, confidentiality‑preserving compute mesh.  
Its topology is designed to:

- Maximize locality,
- Minimize latency,
- Preserve confidentiality,
- Avoid centralization,
- Scale horizontally,
- Remain resilient under failure,
- Support solopreneurs and enterprises equally.

This document describes the **structural layout** of the network without repeating execution, pricing, governance, or identity details covered elsewhere.

---

# Topology Layers

The network consists of four layers:

1. **Mesh Clients**
2. **Steward Layer**
3. **Node Mesh**
4. **Audit & Compliance Layer**

Each layer has a distinct role and strict boundaries.

---

# 1. Mesh Clients

Mesh Clients:

- Encrypt payloads,
- Generate ephemeral keys,
- Request routing instructions,
- Send encrypted chunks,
- Receive encrypted results.

Clients do **not**:

- Communicate directly with other clients,
- Communicate directly with nodes without steward authorization,
- Store network topology information.

Clients are **stateless participants** in the topology.

---

# 2. Steward Layer

The steward is the **routing and coordination layer**.

It:

- Receives encrypted job requests,
- Selects nodes based on locality, performance, and compliance,
- Issues signed routing instructions,
- Forwards encrypted chunks,
- Forwards encrypted results,
- Maintains metadata logs.

The steward does **not**:

- Decrypt payloads,
- Execute jobs,
- Store job content,
- Persist results.

The steward is a **stateless router**, not a compute node.

---

# 3. Node Mesh

Nodes form a **globally distributed compute mesh**.

Characteristics:

- No node is privileged,
- No node has global visibility,
- Nodes do not communicate with each other,
- Nodes only communicate with the steward,
- Nodes execute jobs in RAM,
- Nodes discard all data after execution.

Nodes are **isolated execution endpoints**, not peers in a peer‑to‑peer network.

### Locality‑Aware Routing
The steward selects nodes based on:

- Geographic proximity,
- Network latency,
- Performance class,
- Compliance status.

Locality improves:

- Speed,
- Efficiency,
- Ecological footprint.

### Horizontal Scalability
The mesh scales by:

- Adding more nodes,
- Adding more regions,
- Adding more nodlrs.

No architectural changes are required to scale.

---

# 4. Audit & Compliance Layer

This layer operates **outside the execution path**.

It:

- Monitors compliance signals,
- Verifies zero‑storage enforcement,
- Verifies update compliance,
- Verifies routing fairness,
- Logs metadata for audits.

It does **not**:

- Access payloads,
- Access decrypted data,
- Access node memory.

This layer ensures **trust without visibility**.

---

# Data Flow (Encrypted)

The topology enforces a strict encrypted flow:

At no point does plaintext leave the client.

Nodes only see:

- Encrypted chunks,
- Ephemeral keys (RAM‑only),
- Execution instructions.

The steward only sees:

- Encrypted chunks,
- Metadata,
- Routing context.

---

# Topology Characteristics

### 1. Non‑Hierarchical Node Mesh
Nodes are not arranged in tiers or clusters.  
All nodes are equal participants.

### 2. Steward‑Mediated Routing
All routing flows through the steward.  
Nodes never self‑organize or negotiate.

### 3. Locality‑Optimized
Routing prefers:

- Local nodes,
- Low‑latency paths,
- Regional execution.

### 4. Confidentiality‑Preserving
Topology design ensures:

- No lateral movement,
- No node‑to‑node communication,
- No plaintext exposure,
- No centralized data storage.

### 5. Anti‑Centralization
No region, nodlr, or entity can dominate routing because:

- Routing is performance‑based,
- Locality is distributed,
- Nodes are isolated,
- Identity is immutable.

### 6. Stateless Steward
The steward stores no payloads and no results.  
This prevents:

- Data accumulation,
- Centralized risk,
- Confidentiality breaches.

---

# Regional Topology

Regions are defined by:

- Latency boundaries,
- Network proximity,
- Node density.

Regions are **logical**, not political.

Nodes in a region:

- Are preferred for local jobs,
- Are not aware of each other,
- Do not form clusters.

Regions improve:

- Efficiency,
- Cost,
- Environmental impact.

---

# Global Topology

The global topology is:

- Flat,
- Distributed,
- Horizontally scalable,
- Resilient to regional outages.

If a region fails:

- Jobs route to nearby regions,
- No identity or attribution changes occur,
- No data is lost.

The topology is designed for **global continuity**.

---

# Topology and Confidentiality

The topology reinforces confidentiality by:

- Preventing node‑to‑node communication,
- Preventing lateral movement,
- Preventing centralized storage,
- Ensuring encrypted routing,
- Ensuring RAM‑only execution.

Confidentiality is preserved **by design**, not by policy.

---

# Summary

The network topology ensures:

- Locality‑aware routing,
- Global distribution,
- Stateless coordination,
- Node isolation,
- Confidentiality preservation,
- Horizontal scalability,
- Anti‑centralization,
- Resilience under failure.

The topology is simple, distributed, and secure — by architecture, not by trust.
