# Compute Classes

## Overview
Compute classes define the capability, reliability, and confidentiality level of each node in the wnode network.  
Classes determine:

- Which jobs a node is eligible to receive,
- How workloads are distributed,
- How routing and scheduling behave,
- How confidentiality requirements are enforced.

Compute classes are **not** economic tiers and do not affect nodlr earnings formulas.  
They are purely operational.

---

# Class Hierarchy

The network defines five compute classes:

1. **Class C** — Minimum viable compute  
2. **Class B** — Standard compute  
3. **Class A** — High‑performance compute  
4. **Class A+** — High‑performance with attestation  
5. **Class S** — Steward‑reserved (internal operations only)

Classes are assigned and adjusted by the steward based on performance, compliance, and hardware capability.

---

# Class C — Minimum Viable Compute

Class C nodes:

- Meet minimum hardware requirements,
- Pass basic compliance checks,
- Provide stable but modest performance.

Eligible workloads:

- Lightweight jobs,
- High‑locality micro‑tasks,
- Low‑latency routing probes.

Class C nodes are essential for:

- Geographic coverage,
- Locality diversity,
- Anti‑centralization.

---

# Class B — Standard Compute

Class B nodes:

- Provide consistent performance,
- Maintain stable uptime,
- Pass all compliance checks reliably.

Eligible workloads:

- Standard compute tasks,
- Medium‑complexity jobs,
- Regionally balanced workloads.

Class B is the network’s backbone.

---

# Class A — High‑Performance Compute

Class A nodes:

- Provide high throughput,
- Maintain excellent stability,
- Have strong hardware capability,
- Demonstrate consistent performance scoring.

Eligible workloads:

- Large jobs,
- High‑throughput tasks,
- Confidentiality‑sensitive workloads (encrypted).

Class A nodes receive more complex workloads but must maintain strict compliance.

---

# Class A+ — High‑Performance with Attestation

Class A+ nodes:

- Meet all Class A requirements,
- Provide hardware attestation,
- Provide environment attestation,
- Pass enhanced compliance checks.

Eligible workloads:

- High‑confidentiality workloads,
- Enterprise‑grade tasks,
- Attestation‑required jobs.

A+ is the highest class available to nodlrs.

---

# Class S — Steward‑Reserved

Class S nodes:

- Are internal steward systems,
- Do not execute user workloads,
- Are used for routing, verification, and compliance.

Class S is not available to nodlrs.

---

# Class Assignment

Class assignment is based on:

- Hardware capability,
- Stability metrics,
- Performance scoring,
- Compliance history,
- Attestation availability (A+ only).

Nodes begin at Class C or B depending on hardware and performance.

---

# Class Upgrades

Nodes may be upgraded when:

- Performance scoring improves,
- Stability is demonstrated over time,
- Compliance remains perfect,
- Hardware capability supports higher classes,
- Attestation is available (A+).

Upgrades are:

- Automatic,
- Transparent,
- Logged,
- Reversible.

---

# Class Downgrades

Nodes may be downgraded when:

- Performance degrades,
- Stability drops,
- Compliance lapses,
- Hardware becomes inconsistent,
- Attestation fails (A+ → A).

Downgrades protect:

- Routing fairness,
- Confidentiality,
- System stability.

---

# Class and Routing

Class influences routing by:

- Determining job eligibility,
- Matching workload complexity to capability,
- Ensuring confidentiality requirements are met.

Routing order:

1. Compliance  
2. Locality  
3. Performance score  
4. Compute class  
5. Resource availability  

Class never overrides compliance or fairness.

---

# Class and Confidentiality

Confidentiality requirements:

- Class C/B: Standard encrypted workloads  
- Class A: High‑complexity encrypted workloads  
- Class A+: Attestation‑required workloads  

A+ nodes provide:

- Hardware attestation,
- Environment attestation,
- Enhanced compliance guarantees.

Confidentiality is preserved by architecture, not trust.

---

# Anti‑Centralization Safeguards

Compute classes prevent centralization by:

- Allowing lower‑class nodes to serve local workloads,
- Preventing high‑class nodes from monopolizing routing,
- Ensuring regional diversity,
- Enforcing performance‑based fairness.

Large operators cannot dominate routing simply by adding hardware.

---

# Summary

Compute classes ensure:

- Capability‑appropriate workload distribution,
- Confidentiality‑aligned routing,
- Performance‑based fairness,
- Anti‑centralization,
- Transparent upgrades and downgrades,
- Attestation‑based trust for sensitive workloads.

Classes define what a node *can* do.
