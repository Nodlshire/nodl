# Failure Modes

## Overview
Failure modes define how nodes, the steward, routing, attestation, and the network behave when something goes wrong.  
Failure modes ensure:

- Confidentiality is never compromised,
- Identity is never compromised,
- Lineage is never compromised,
- Economics are never compromised,
- Routing remains fair,
- The system fails safely and predictably.

This document defines failure modes without repeating compliance, routing, or lifecycle details covered elsewhere.

---

# Failure Mode Principles

All failure modes follow six constitutional principles:

1. **Fail closed, not open**
2. **Fail silent, not verbose**
3. **Fail stateless, not persistent**
4. **Fail isolated, not cascading**
5. **Fail recoverable, not corrupting**
6. **Fail confidential, not exposed**

These principles cannot be overridden.

---

# Categories of Failure Modes

The network recognizes five categories:

1. **Node Failure Modes**
2. **Routing Failure Modes**
3. **Attestation Failure Modes**
4. **Steward Failure Modes**
5. **Network‑Wide Failure Modes**

Each category has strict constitutional behavior.

---

# 1. Node Failure Modes

Nodes may fail due to:

- Hardware crash,
- Power loss,
- Kernel panic,
- Runtime corruption,
- Compliance violation,
- Out‑of‑date runtime,
- Attestation failure (A+).

Node failure behavior:

- All RAM is lost,
- All ephemeral keys are lost,
- All job data is lost,
- No persistence exists,
- No confidentiality is compromised.

Node failure is a confidentiality guarantee.

---

# 2. Routing Failure Modes

Routing may fail due to:

- Regional instability,
- Cluster collapse,
- Latency spikes,
- Steward connectivity issues,
- Node churn.

Routing failure behavior:

- Jobs retry with new ephemeral keys,
- New routing instructions are issued,
- No previous state is reused,
- No job data is exposed,
- No node identity is exposed.

Routing failures are stateless and safe.

---

# 3. Attestation Failure Modes

Attestation may fail due to:

- Hardware mismatch,
- Enclave corruption,
- Kernel modification,
- Runtime modification,
- Signature mismatch,
- Environment drift.

Attestation failure behavior:

- A+ → A downgrade (if safe),
- Or immediate suspension,
- Sensitive workloads blocked,
- Nodlr notified,
- Steward logs event.

Attestation failures never expose data.

---

# 4. Steward Failure Modes

The steward may fail due to:

- Update corruption,
- Internal crash,
- Connectivity loss,
- Market data unavailability,
- Metric aggregation failure.

Steward failure behavior:

- Routing pauses,
- No jobs are assigned,
- No identity is modified,
- No lineage is modified,
- No economics are modified,
- No plaintext is exposed.

The steward fails neutral — never biased.

---

# 5. Network‑Wide Failure Modes

Network‑wide failures may occur due to:

- Backbone outages,
- Regional collapse,
- Cloud provider failure,
- Global latency spikes,
- Mass node churn.

Network‑wide failure behavior:

- Regions rebalance,
- Fallback routing expands,
- Jobs retry safely,
- No data is lost (RAM‑only),
- No confidentiality is compromised.

The network is self‑healing.

---

# Forbidden Failure Modes

The following failure modes are constitutionally forbidden:

- Plaintext exposure,
- Identity exposure,
- Lineage corruption,
- Founder economics modification,
- Persistent state leakage,
- Cross‑job contamination,
- Privileged routing,
- Silent rule changes,
- Undocumented behavior.

Forbidden failure modes cannot occur under any circumstances.

---

# Failure Mode Logging

All failures must be:

- Logged,
- Versioned,
- Steward‑signed,
- Confidentiality‑preserving.

Logs include:

- Timestamp,
- Failure category,
- Aggregated metadata,
- Steward signature.

Logs never include sensitive data.

---

# Failure Mode Recovery

Recovery follows:

1. **Stabilize**
2. **Verify compliance**
3. **Re‑attest (A+)**
4. **Re‑establish routing**
5. **Resume operation**

Recovery must:

- Preserve confidentiality,
- Preserve identity,
- Preserve lineage,
- Preserve economics.

Recovery cannot modify constitutional constraints.

---

# Summary

Failure modes ensure:

- Safe node crashes,
- Safe routing failures,
- Safe attestation failures,
- Safe steward failures,
- Safe network‑wide failures,
- No confidentiality compromise,
- No identity compromise,
- No lineage compromise,
- No economic compromise.
