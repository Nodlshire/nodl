# Mesh Routing and Execution

## Routing Hints

Routing hints are **declarative constraints** that guide the mesh toward a deterministic execution path.  
They do not force routing; they shape the decision space.

Routing hints include:
- region preference
- node class preference
- latency vs throughput bias
- privacy mode constraints
- deterministic routing boundaries
- shard placement rules

Hints must be:
- explicit
- reproducible
- non-heuristic
- non-probabilistic

The mesh uses hints to compute a **deterministic routing plan** that is identical across environments.

---

## Region and Device Classes

Wnode’s mesh is composed of heterogeneous node classes:

### Region Classes
- EU‑Core  
- US‑Core  
- APAC‑Core  
- Edge‑Local  
- Edge‑Remote  

Region hints allow developers to:
- minimize latency  
- comply with jurisdictional constraints  
- optimize for deterministic replay  
- reduce cross-region variance  

### Device Classes
- CPU‑general  
- CPU‑high‑performance  
- GPU‑compute  
- GPU‑AI  
- WASM‑micro  
- IoT‑edge  

Device class hints ensure:
- predictable performance  
- deterministic shard execution  
- consistent reduction behavior  

The SDK never infers region or device class.  
All hints must be explicitly declared.

---

## Latency and Cost Sensitivity

Latency and cost sensitivity are **deterministic preferences**, not dynamic heuristics.

### Latency Sensitivity
Developers may declare:
- low-latency preference  
- high-throughput preference  
- balanced mode  

Latency sensitivity affects:
- region selection  
- node class selection  
- shard distribution  
- reduction timing  

### Cost Sensitivity
Cost sensitivity is deterministic:
- fixed-cost mode  
- cost‑bounded mode  
- cost‑agnostic mode  

The mesh does **not** perform dynamic cost optimization.  
It follows the declared deterministic rules.

---

## Deterministic Path Selection

Path selection is the core of sovereign compute.

The mesh computes a deterministic path using:
- routing hints  
- region constraints  
- device class constraints  
- privacy mode  
- shard configuration  
- reduction rules  

Deterministic path selection guarantees:
- same job → same path  
- same shards → same nodes  
- same reduction → same output  
- replayable execution  
- verifiable lineage  

Path selection cannot depend on:
- node availability  
- node load  
- timing  
- randomness  
- heuristics  
- inference  

If the mesh cannot compute a deterministic path, the job is rejected.

---

## Steward Interaction

The Steward is the **execution authority** for Wnode.

The SDK interacts with the Steward by producing:
- calldata-only payloads  
- unsigned job objects  
- deterministic metadata  
- reproducible shard definitions  
- explicit routing hints  

The Steward performs:
- job validation  
- routing plan computation  
- shard distribution  
- reduction  
- verification  
- lineage tracking  

The SDK never:
- executes jobs  
- routes jobs  
- shards jobs  
- reduces outputs  
- verifies results  

The SDK is a **pure declarative interface**.  
The Steward is the **deterministic execution engine**.

---
