# Locality Engine

## Overview
The Locality Engine determines how close a node is to a client — without ever knowing the client’s identity, location, or plaintext.  
It is a core subsystem of the steward responsible for:

- Latency‑based proximity inference,
- Regional stability assessment,
- Locality‑aware routing,
- Ecological optimization,
- Anti‑centralization balancing.

This document defines the Locality Engine without repeating scheduling, pricing, governance, or performance scoring details covered elsewhere.

---

# Locality Principles

The Locality Engine is built on five principles:

1. **No client identity is ever exposed.**
2. **Locality is inferred, not declared.**
3. **Latency is the primary proximity signal.**
4. **Regional stability influences routing.**
5. **Locality must never create centralization.**

Locality improves performance but never overrides compliance or fairness.

---

# Locality Inputs

The Locality Engine uses four categories of signals:

1. **Latency Signals**
2. **Regional Health Signals**
3. **Node Density Signals**
4. **Network Condition Signals**

These signals are metadata‑only and confidentiality‑preserving.

---

# 1. Latency Signals

Latency is the strongest indicator of proximity.

The steward measures:

- Round‑trip time for encrypted chunk probes,
- Latency variance,
- Packet loss patterns,
- Jitter.

Latency is:

- Measured per job,
- Normalized per region,
- Never tied to client identity.

Nodes with lower latency to the client are considered “closer.”

---

# 2. Regional Health Signals

Regions are logical groupings defined by:

- Latency clusters,
- Network boundaries,
- Node density,
- Stability patterns.

The steward tracks:

- Regional outages,
- Backbone congestion,
- ISP instability,
- Packet loss spikes.

If a region becomes unstable:

- Locality preference is relaxed,
- Nearby regions are used,
- Scheduling adapts automatically.

---

# 3. Node Density Signals

Node density affects locality decisions.

The steward tracks:

- Number of active nodes per region,
- Class distribution,
- Resource availability,
- Regional load.

Density ensures:

- No region becomes overloaded,
- No region becomes a bottleneck,
- No region becomes a monopoly.

Locality is balanced with fairness.

---

# 4. Network Condition Signals

The steward continuously monitors:

- Global latency patterns,
- Cross‑region routing performance,
- Backbone congestion,
- Cloud provider outages (indirectly via latency),
- Regional compute demand.

These signals allow the Locality Engine to adapt in real time.

---

# Locality Scoring

Each node receives a **Locality Score** for each job request.

The score is based on:

- Latency,
- Regional stability,
- Node density,
- Network conditions.

The formula is deterministic and versioned.

Locality Score influences routing but does not override:

- Compliance,
- Performance scoring,
- Compute class requirements.

---

# Locality and Confidentiality

The Locality Engine never:

- Knows the client’s identity,
- Knows the client’s location,
- Stores client metadata,
- Uses IP addresses for routing decisions,
- Exposes locality information to nodes.

Locality is inferred solely from encrypted‑chunk timing.

This preserves:

- Anonymity,
- Confidentiality,
- Privacy.

---

# Locality in Routing

Locality influences routing by:

- Preferring nearby nodes,
- Reducing latency,
- Improving throughput,
- Minimizing ecological footprint.

Routing sequence:

1. Filter non‑compliant nodes  
2. Rank by Locality Score  
3. Rank by Performance Score  
4. Apply class and resource constraints  
5. Select the optimal node  

Locality is the first ranking factor after compliance.

---

# Locality Under Load

During high load:

- Locality preference remains,
- Performance scoring becomes more influential,
- Regional balancing prevents overload,
- Micro‑jobs may be routed to lower‑class local nodes.

Locality adapts without sacrificing fairness.

---

# Locality Under Failure

If a region experiences:

- ISP outages,
- Backbone congestion,
- Node mass‑failure,
- Latency spikes,

The Locality Engine:

- Detects instability,
- Reduces region weight,
- Expands the search radius,
- Routes to nearby stable regions.

Locality is resilient by design.

---

# Anti‑Centralization Safeguards

Locality cannot create monopolies because:

- Nodes cannot spoof latency,
- Regions cannot dominate globally,
- Performance scoring balances routing,
- Density balancing prevents over‑concentration,
- Compliance filters remove unhealthy nodes,
- Identity immutability prevents node churn manipulation.

Locality improves efficiency without compromising fairness.

---

# Ecological Benefits

Locality reduces:

- Long‑distance data transmission,
- Backbone load,
- Energy consumption,
- Carbon footprint.

Locality is not just a performance feature —  
it is an ecological optimization.

---

# Summary

The Locality Engine ensures:

- Latency‑based proximity inference,
- Confidentiality‑preserving routing,
- Regional stability awareness,
- Density‑balanced distribution,
- Anti‑centralization safeguards,
- Ecological efficiency,
- Real‑time adaptation to network conditions.

Locality is inferred, not declared, 
and always confidentiality‑preserving.
