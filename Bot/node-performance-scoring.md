# Node Performance Scoring

## Overview
Node performance scoring determines how frequently a node is selected for jobs.  
It is the steward’s quantitative model for evaluating:

- Stability,
- Speed,
- Reliability,
- Compliance,
- Resource consistency,
- Real‑world performance under load.

This document defines the scoring algorithm without repeating scheduling, pricing, governance, or lifecycle details covered elsewhere.

---

# Scoring Philosophy

The scoring model is designed to be:

- **Fair** — no node can game the system.
- **Deterministic** — identical behavior yields identical scores.
- **Adaptive** — scores adjust to real‑world conditions.
- **Transparent** — scoring rules are public and auditable.
- **Anti‑centralization** — large operators cannot dominate routing.
- **Confidentiality‑preserving** — no plaintext is ever involved.

Scores influence routing frequency but never identity, economics, or lineage.

---

# Score Components

A node’s performance score is composed of six weighted components:

1. **Latency Score**
2. **Stability Score**
3. **Success Rate Score**
4. **Throughput Score**
5. **Resource Consistency Score**
6. **Compliance Score**

Each component ranges from 0 to 1.  
The final score is a weighted sum.

FinalScore =
(Latency * w1) +
(Stability * w2) +
(SuccessRate * w3) +
(Throughput * w4) +
(ResourceConsistency * w5) +
(Compliance * w6)


Weights are public and versioned.

---

# 1. Latency Score

Latency is measured as:

- Round‑trip time for encrypted chunks,
- Averaged over recent jobs,
- Normalized per region.

Scoring:

- Low latency → high score,
- High latency → lower score,
- Regional normalization prevents geographic bias.

Latency cannot be spoofed because:

- Measurements originate from the steward,
- Nodes cannot influence timing.

---

# 2. Stability Score

Stability measures:

- Crash frequency,
- Unexpected restarts,
- Heartbeat consistency,
- Thermal throttling events.

Scoring:

- Stable nodes score high,
- Nodes with intermittent failures score lower,
- Catastrophic failures drop the score sharply.

Stability ensures unreliable nodes do not receive critical workloads.

---

# 3. Success Rate Score

Success rate measures:

- Completed jobs,
- Failed jobs,
- Interrupted jobs,
- Retry‑triggered failures.

Scoring:

- High completion rate → high score,
- Frequent failures → lower score,
- Failures due to regional outages are normalized.

Success rate is the strongest predictor of reliability.

---

# 4. Throughput Score

Throughput measures:

- Time‑to‑completion relative to class expectations,
- Efficiency under load,
- Execution speed consistency.

Scoring:

- Faster‑than‑expected nodes score higher,
- Slower‑than‑expected nodes score lower,
- Outliers are smoothed to prevent volatility.

Throughput ensures high‑class nodes behave like high‑class nodes.

---

# 5. Resource Consistency Score

Resource consistency measures:

- Available RAM,
- CPU headroom,
- Thermal stability,
- Load variance.

Scoring:

- Consistent resource availability → high score,
- Frequent resource contention → lower score.

This prevents overloaded nodes from receiving more work.

---

# 6. Compliance Score

Compliance measures:

- Zero‑storage confirmations,
- RAM‑execution confirmations,
- Update status,
- Hardware fingerprint consistency,
- Attestation validity (A+).

Scoring:

- Fully compliant → full score,
- Minor issues → reduced score,
- Violations → immediate suspension (score irrelevant).

Compliance is a hard requirement.

---

# Score Decay and Recovery

Scores are dynamic.

### **Decay**
Scores decay when:

- Latency worsens,
- Stability drops,
- Failures increase,
- Compliance lapses,
- Resources fluctuate.

Decay is gradual unless violations occur.

### **Recovery**
Scores recover when:

- Performance improves,
- Updates are applied,
- Stability returns,
- Regional conditions normalize.

Recovery is proportional to improvement.

---

# Anti‑Gaming Protections

Nodes cannot manipulate their score because:

- All metrics originate from steward‑verified signals,
- Nodes cannot influence timing or measurement,
- Nodes cannot hide failures,
- Nodes cannot spoof hardware fingerprints,
- Nodes cannot self‑report performance.

The scoring model is resistant to:

- Latency spoofing,
- Artificial throttling,
- Load manipulation,
- Identity laundering.

---

# Influence on Routing

Performance score influences:

- Routing frequency,
- Job eligibility,
- Workload type,
- Class adjustments.

High‑scoring nodes:

- Receive more jobs,
- Receive higher‑value workloads,
- Are preferred for locality‑critical tasks.

Low‑scoring nodes:

- Receive fewer jobs,
- Receive lighter workloads,
- May be flagged for compliance review.

Scores never influence:

- Identity,
- Attribution,
- Founder economics.

---

# Transparency and Versioning

The steward publishes:

- Scoring weights,
- Scoring formulas,
- Version history,
- Change logs.

Nodes and nodlrs can always see:

- Their current score,
- Score breakdown,
- Score history,
- Reasons for changes.

Transparency prevents distrust and manipulation.

---

# Summary

Node performance scoring ensures:

- Fair workload distribution,
- High reliability,
- Strong compliance,
- Efficient routing,
- Anti‑centralization,
- Transparent evaluation,
- Adaptive behavior under real‑world conditions.

Performance scoring is the steward’s quantitative backbone,  
objective, auditable, and ungameable.
