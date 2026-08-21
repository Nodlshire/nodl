# Steward Metrics

## Overview
Steward metrics define what the steward measures, how it measures it, and how those measurements influence routing, compliance, performance scoring, and network health.

Metrics ensure:

- Fairness,
- Stability,
- Confidentiality,
- Anti‑centralization,
- Transparent behavior,
- Predictable routing.

This document defines steward metrics without repeating compute classes, routing instructions, or compliance details covered elsewhere.

---

# Metric Principles

Steward metrics follow six constitutional principles:

1. **No plaintext**
2. **No identity**
3. **No location**
4. **Metadata only**
5. **Deterministic aggregation**
6. **Transparent and auditable behavior**

Metrics must never compromise confidentiality.

---

# Categories of Metrics

The steward tracks five categories of metrics:

1. **Performance Metrics**
2. **Stability Metrics**
3. **Locality Metrics**
4. **Compliance Metrics**
5. **Market Metrics**

Each category influences different parts of the system.

---

# 1. Performance Metrics

Performance metrics measure:

- Job success rate,
- Job failure rate,
- Execution time,
- Result return time,
- Resource usage patterns.

Performance metrics influence:

- Performance scoring,
- Routing priority,
- Compute class upgrades/downgrades.

Performance metrics never include:

- Job content,
- User identity,
- Node identity beyond fingerprint.

---

# 2. Stability Metrics

Stability metrics measure:

- Uptime,
- Crash frequency,
- Heartbeat consistency,
- Latency variance,
- Node churn.

Stability metrics influence:

- Routing reliability,
- Cluster formation,
- Regional health scoring,
- Compute class adjustments.

Stability is essential for predictable routing.

---

# 3. Locality Metrics

Locality metrics measure:

- Latency between nodes,
- Latency between nodes and steward,
- Latency patterns over time,
- Regional proximity clusters.

Locality metrics influence:

- Region selection,
- Cluster formation,
- Routing efficiency,
- Fallback behavior.

Locality is inferred — never stored as physical location.

---

# 4. Compliance Metrics

Compliance metrics measure:

- Zero‑storage enforcement,
- RAM‑only execution,
- Swap usage (must be zero),
- Attestation status (A+),
- Runtime integrity,
- Update version.

Compliance metrics influence:

- Node activation,
- Node suspension,
- Compute class eligibility,
- Routing eligibility.

Compliance is constitutional.

---

# 5. Market Metrics

Market metrics measure:

- Regional node density,
- Regional job demand,
- Cloud compute pricing,
- Spot volatility,
- Energy‑adjusted compute cost.

Market metrics influence:

- Incentive adjustments,
- Regional balancing,
- Temporary boosts,
- Market health scoring.

Market metrics never influence earnings formulas.

---

# Metric Aggregation

Metrics are aggregated:

- Per node (fingerprint only),
- Per region (logical, not geographic),
- Per cluster,
- Per job type,
- Per time window.

Aggregation is:

- Deterministic,
- Confidentiality‑preserving,
- Stateless per job,
- Logged for audit.

No metric contains user identity.

---

# Metric Storage

The steward stores:

- Aggregated metrics,
- Compliance logs,
- Performance summaries,
- Regional health scores.

The steward does **not** store:

- Payloads,
- Results,
- Plaintext,
- Ephemeral keys,
- Node IP addresses,
- Physical location.

Storage is metadata‑only.

---

# Metric Influence on Routing

Metrics influence routing in this order:

1. Compliance  
2. Locality  
3. Performance score  
4. Compute class  
5. Resource availability  
6. Regional health  

Metrics ensure routing is:

- Fair,
- Efficient,
- Confidentiality‑preserving,
- Anti‑centralized.

---

# Metric Influence on Compute Classes

Metrics determine:

- Upgrades (A → A+, B → A, etc.),
- Downgrades,
- Eligibility for sensitive workloads.

Metrics ensure compute classes reflect:

- Real capability,
- Real stability,
- Real compliance.

Classes cannot be manually changed.

---

# Metric Influence on Incentives

Metrics influence:

- Temporary regional boosts,
- Density balancing incentives,
- Off‑peak bonuses.

Incentives are:

- Transparent,
- Time‑bound,
- Non‑discretionary.

Metrics never modify earnings formulas.

---

# Metric Logging and Auditability

All metrics are:

- Logged,
- Versioned,
- Steward‑signed,
- Auditable.

Logs include:

- Timestamp,
- Metric type,
- Aggregated values,
- Steward signature.

Logs never include sensitive data.

---

# Anti‑Manipulation Safeguards

Metrics prevent manipulation by:

- Large operators,
- Regional cartels,
- Coordinated node behavior.

Safeguards include:

- Density balancing,
- Performance normalization,
- Regional smoothing,
- Outlier detection.

No operator can distort metrics.

---

# Summary

Steward metrics ensure:

- Fair routing,
- Stable operation,
- Confidentiality preservation,
- Compliance enforcement,
- Anti‑centralization,
- Transparent incentives,
- Predictable behavior.

Metrics are the steward’s senses, 
metadata‑only, constitutional, and incorruptible.

---

## Technical Scoring Specifications

The steward maintains two primary quantitative models for evaluating participants:

### 1. Integrity Score (0–1000)
Every participant (Nodlr) is assigned an **Integrity Score** that measures their long-term compliance and reliability.

- **0–300 (Compromised)**: High risk. Subject to **Ghost Protocol** (Shadow-benching).
- **300–600 (Evaluating)**: Subject to frequent **Honeypot** timing-check tasks.
- **600–900 (Trusted)**: Standard operating range for high-class compute.
- **900–1000 (Sovereign)**: Elite status for consistent, long-term, compliant nodes.

### 2. Node Health Score (0.0–1.0)
Individual hardware sessions are evaluated in real-time based on stability:

- **Latency (RTT)**: Measured every 30s. Spikes > 500ms trigger penalties.
- **Flap Count**: Number of disconnects within a rolling window.
- **Incremental Uptime**: Measured in minutes; 1000 hours of uptime are required for full credit.
- **Green Contribution**: Carbon saved (kg) contributes to the health multiplier.

These scores are deterministic and are used to influence **Compute Class** eligibility and **Routing Frequency**.
