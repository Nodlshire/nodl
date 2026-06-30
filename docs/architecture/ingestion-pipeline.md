# Wnode Architecture — Ingestion Pipeline

![diagram](/diagrams/ingestion-pipeline-overview.png)

The Ingestion Pipeline is the constitutional entrypoint into Wnode’s sovereign compute mesh.  
It is fully deterministic, stateless, and governed by Routing Epochs.  
Every request entering the mesh follows the same strict sequence:

1. Signed request  
2. Ingress rule evaluation  
3. Routing Epoch validation  
4. Deterministic filtering  
5. Mesh selection  
6. Execution  
7. Telemetry emission  

No nondeterministic scheduling.  
No global state.  
No fallback paths.

---

## Signed Request

All ingestion begins with a signed request containing:

- identity proofs  
- capability declarations  
- region constraints  
- device constraints  
- latency sensitivity  
- cost sensitivity  

Unsigned or malformed requests are rejected deterministically.

---

## Ingress Rules

Ingress rules define:

- allowed regions  
- allowed device classes  
- allowed capabilities  
- forbidden capabilities  
- required metadata  

Ingress rules are part of the Routing Epoch and validated locally by nodes.

---

## Routing Epoch Validation

Nodes validate the active Routing Epoch:

- signature verification  
- version monotonicity  
- capability alignment  
- ingress rule correctness  

Invalid epochs halt ingestion deterministically.

---

## Region Class Filtering

Region classes ensure sovereign locality:

- EU  
- US  
- APAC  
- LATAM  
- AFR  

Requests may specify required, allowed, or forbidden regions.

Nodes filter themselves deterministically.

---

## Device Class Filtering

Device classes ensure hardware alignment:

- CPU  
- GPU  
- TPU  
- Edge  
- High‑Memory  
- High‑IO  

Requests may specify required, preferred, or forbidden device classes.

Nodes filter themselves deterministically.

---

## Capability Boundary Enforcement

Nodes enforce capability boundaries defined in:

- spec.yaml  
- daemon capability registry  
- Routing Epoch capability map  

Unauthorized operations trap instantly.

---

## Deterministic Mesh Selection

![diagram](/diagrams/ingestion-pipeline-flow.png)

Mesh selection is deterministic:

- **Earth Mesh (Tier‑1)** for low‑latency, synchronous workloads  
- **Space Mesh (Tier‑2)** for parallel, high‑throughput workloads  

Selection is based on:

- latency sensitivity  
- cost sensitivity  
- device class  
- region class  
- capability boundaries  

No randomness.  
No heuristics.  
No nondeterministic ordering.

---

## Deterministic Ingestion Flow

![diagram](/diagrams/ingestion-pipeline-flow.png)

The ingestion flow is:

1. Signed request → ingress rules  
2. Routing Epoch validation  
3. Region class filtering  
4. Device class filtering  
5. Capability boundary enforcement  
6. Deterministic mesh selection  
7. Execution → telemetry emission  

No randomness.  
No heuristics.  
No nondeterministic ordering.

---

## Execution → Telemetry Emission

Execution produces:

- deterministic results  
- signed telemetry envelopes  
- monotonic counters  
- capability usage summaries  

Telemetry is:

- signed  
- encrypted  
- never retained locally  
- never stored globally  

The orchestrator receives telemetry but does not interpret or store it.

---

## Summary

The Ingestion Pipeline provides:

- deterministic sovereign intake  
- strict ingress rule enforcement  
- epoch‑driven routing  
- hardware‑aligned execution  
- region‑aligned locality  
- zero‑custody guarantees  

It is the constitutional front door of Wnode.

---
