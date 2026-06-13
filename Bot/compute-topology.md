# Compute Topology

## Overview
Compute topology defines the global structure of the wnode network — how nodes relate to each other, how regions form, how clusters emerge, and how the steward understands the mesh without ever knowing identity or location.

Topology ensures:

- Resilience,
- Decentralization,
- Efficient routing,
- Confidentiality preservation,
- Fair workload distribution,
- Adaptation to failures and congestion.

This document defines compute topology without repeating locality, routing, compute classes, or node lifecycle details covered elsewhere.

---

# Topology Principles

The compute topology is built on six principles:

1. **No node knows the global map.**
2. **The steward sees only metadata, never identity.**
3. **Regions form organically from latency clusters.**
4. **Topology adapts continuously to network conditions.**
5. **No region can dominate the network.**
6. **Topology must preserve confidentiality.**

Topology is emergent — not manually configured.

---

# Topology as a Graph

The steward models the network as a **dynamic graph**:

- Nodes are vertices,
- Latency relationships are edges,
- Edge weights represent proximity and stability,
- Clusters form naturally from low‑latency groups.

The graph is:

- Continuously updated,
- Confidentiality‑preserving,
- Stateless per job,
- Deterministic in structure.

The steward never stores:

- IP addresses,
- Physical locations,
- User identity,
- Node identity beyond fingerprint.

Topology is metadata‑only.

---

# Regions

Regions are **logical clusters** defined by:

- Latency similarity,
- Stability patterns,
- Node density,
- Backbone behavior.

Regions are:

- Emergent,
- Dynamic,
- Confidentiality‑preserving,
- Not tied to geography.

A region may correspond to:

- A city,
- A country,
- A cloud provider zone,
- An ISP cluster,
- A backbone segment.

The steward does not know which.

---

# Clusters

Clusters are smaller groups within regions.

Clusters form when:

- Nodes have extremely low mutual latency,
- Nodes share similar stability patterns,
- Nodes exhibit similar performance characteristics.

Clusters are used for:

- Micro‑routing,
- Locality optimization,
- Load balancing.

Clusters are not exposed to nodes.

---

# Topology Layers

The topology has three layers:

1. **Global Layer**  
   - High‑level view of all regions  
   - Used for fallback and resilience  

2. **Regional Layer**  
   - Nodes grouped by latency and density  
   - Used for primary routing decisions  

3. **Cluster Layer**  
   - Fine‑grained proximity groups  
   - Used for micro‑optimizations  

Each layer is independent but interconnected.

---

# Topology and Routing

Topology influences routing by:

- Identifying nearby nodes,
- Avoiding unstable regions,
- Balancing load across clusters,
- Preventing monopolies,
- Ensuring fairness.

Routing sequence (simplified):

1. Compliance  
2. Topology (region + cluster)  
3. Locality  
4. Performance score  
5. Compute class  
6. Resource availability  

Topology is the structural foundation of routing.

---

# Topology and Confidentiality

Topology preserves confidentiality by:

- Never storing physical location,
- Never storing IP addresses,
- Never storing identity,
- Never exposing cluster membership,
- Never exposing region membership.

Nodes only know:

- They received a job,
- They must execute it in RAM,
- They must return encrypted results.

Topology is invisible to nodes.

---

# Topology and Resilience

Topology enables resilience by:

- Detecting regional outages,
- Detecting backbone congestion,
- Detecting cluster instability,
- Automatically rerouting workloads,
- Expanding search radius during failures.

If a region collapses:

- Nearby regions absorb load,
- Global topology rebalances,
- No data is lost (RAM‑only execution),
- No confidentiality is compromised.

Topology is self‑healing.

---

# Topology and Anti‑Centralization

Topology prevents centralization by:

- Ensuring no region can dominate,
- Ensuring no cluster can monopolize routing,
- Balancing load across regions,
- Enforcing performance‑based fairness,
- Enforcing compute class boundaries,
- Enforcing density balancing.

Large operators cannot:

- Force traffic into their region,
- Manipulate topology,
- Collapse clusters to gain advantage.

Topology is constitutionally neutral.

---

# Topology and Compute Classes

Compute classes interact with topology by:

- Determining which nodes are eligible for which jobs,
- Ensuring high‑class nodes do not dominate routing,
- Allowing lower‑class nodes to serve local workloads,
- Maintaining diversity across regions.

Topology ensures:

- Class A+ nodes serve sensitive workloads,
- Class A/B nodes serve general workloads,
- Class C nodes serve locality‑critical workloads.

Classes and topology reinforce each other.

---

# Topology Evolution

Topology evolves when:

- Nodes join or leave,
- Regions grow or shrink,
- Latency patterns shift,
- Backbone conditions change,
- Clusters merge or split.

Evolution is:

- Continuous,
- Deterministic,
- Logged,
- Confidentiality‑preserving.

No manual intervention is required.

---

# Summary

Compute topology ensures:

- A dynamic, resilient global mesh,
- Confidentiality‑preserving structure,
- Emergent regions and clusters,
- Fair and efficient routing,
- Anti‑centralization safeguards,
- Adaptation to failures and congestion,
- Transparent and deterministic behavior.
