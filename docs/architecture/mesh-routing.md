# Wnode Architecture — Mesh Routing

![diagram](/diagrams/mesh-routing-overview.png)

Mesh Routing is the constitutional mechanism that determines how workloads traverse Wnode’s sovereign compute mesh.  
Routing is **deterministic**, **stateless**, and **epoch‑driven**.  
Nodes make routing decisions locally using the currently active **Routing Epoch**.

Routing never depends on:
- global state
- orchestrator availability
- nondeterministic scheduling
- mutable routing tables

All routing is derived from:
- ingress rules
- region classes
- device classes
- latency sensitivity
- cost sensitivity
- capability boundaries

---

## Routing Epochs — Deterministic Control Plane

Routing Epochs define:
- ingress filters
- region constraints
- device constraints
- capability boundaries
- version monotonicity
- cryptographic signatures

Nodes validate epochs locally:
- signature verification
- version correctness
- capability alignment

Invalid epochs are rejected deterministically.

---

## Region Classes

Region classes ensure sovereign locality:
- EU
- US
- APAC
- LATAM
- AFR

Requests may specify:
- required region
- allowed regions
- forbidden regions

Nodes deterministically filter themselves based on region membership.

---

## Device Classes

Device classes ensure hardware alignment:
- CPU
- GPU
- TPU
- Edge
- High‑Memory
- High‑IO

Requests may specify:
- required device class
- preferred device class
- forbidden device class

Nodes deterministically filter themselves based on device capability.

---

## Latency Sensitivity

Latency sensitivity determines whether a request is routed to:
- Earth Mesh (low latency)
- Space Mesh (high throughput)

Latency classes:
- ultra‑low
- low
- medium
- high
- batch

Routing is deterministic based on declared sensitivity.

---

## Cost Sensitivity

Cost sensitivity determines:
- preferred node class
- preferred region
- preferred device type

Cost classes:
- strict‑low
- low
- balanced

---

## Deterministic Path Selection Flow

![diagram](/diagrams/mesh-routing-flow.png)

The routing flow is:

1. Signed request → ingress rules  
2. Region class filtering  
3. Device class filtering  
4. Latency sensitivity check  
5. Cost sensitivity check  
6. Deterministic path selection  
7. Execution → telemetry emission  

No randomness.  
No heuristics.  
No nondeterministic ordering.

---
