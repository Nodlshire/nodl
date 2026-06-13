# Compute Scheduling

## Overview
Compute scheduling determines **which node executes which job**.  
It is the steward’s responsibility to ensure that scheduling is:

- Fair,
- Locality‑aware,
- Performance‑optimized,
- Confidentiality‑preserving,
- Anti‑centralization,
- Predictable,
- Auditable.

This document defines the scheduling model without repeating pricing, governance, identity, or RAM‑execution details covered elsewhere.

---

# Scheduling Inputs

The scheduler considers six inputs:

1. **Locality**
2. **Node performance score**
3. **Compute class**
4. **Resource availability**
5. **Compliance status**
6. **Network conditions**

These inputs are evaluated per job, not per node.

---

# 1. Locality

Locality is the strongest scheduling signal.

The scheduler prefers nodes that are:

- Geographically close,
- Low‑latency,
- Network‑proximal,
- Regionally stable.

Locality improves:

- Speed,
- Efficiency,
- Ecological footprint.

Locality never overrides compliance or performance requirements.

---

# 2. Node Performance Score

Each node maintains a dynamic performance score based on:

- Latency,
- Stability,
- Job success rate,
- Resource consistency,
- Update compliance.

Higher scores increase routing frequency.

Performance scoring is:

- Continuous,
- Self‑correcting,
- Transparent,
- Non‑manipulable.

Nodes cannot artificially inflate their score.

---

# 3. Compute Class

Compute class determines:

- Job eligibility,
- Workload type,
- Expected throughput.

Higher classes receive:

- Larger jobs,
- More complex workloads,
- Confidentiality‑sensitive tasks (A+).

Lower classes receive:

- Lightweight jobs,
- High‑locality tasks,
- Low‑latency micro‑workloads.

Class does not override compliance or performance.

---

# 4. Resource Availability

Nodes report:

- Free RAM,
- CPU availability,
- Current load,
- Thermal state.

The scheduler ensures:

- No node is overloaded,
- Jobs fit available resources,
- RAM‑only execution is feasible.

Resource availability is evaluated in real time.

---

# 5. Compliance Status

Nodes must be:

- Zero‑storage compliant,
- Update compliant,
- Identity‑verified,
- Hardware‑consistent.

Non‑compliant nodes:

- Are deprioritized,
- May be suspended,
- Cannot receive jobs.

Compliance is a hard requirement.

---

# 6. Network Conditions

The scheduler adapts to:

- Regional outages,
- Backbone congestion,
- Latency spikes,
- Packet loss patterns.

If a region becomes unstable:

- Locality preference is relaxed,
- Jobs route to nearby regions,
- Scheduling remains deterministic.

---

# Scheduling Algorithm Overview

The scheduling algorithm follows a strict sequence:

1. **Filter**  
   Remove nodes that are:
   - Non‑compliant,
   - Overloaded,
   - Unavailable,
   - Regionally unstable.

2. **Rank**  
   Rank remaining nodes by:
   - Locality,
   - Performance score,
   - Compute class,
   - Resource availability.

3. **Select**  
   Choose the highest‑ranked eligible node.

4. **Verify**  
   Confirm:
   - Hardware fingerprint,
   - Compliance status,
   - Attestation (A+),
   - Update status.

5. **Assign**  
   Issue signed routing instructions to the client.

6. **Monitor**  
   Track job execution and adjust performance scores.

This sequence ensures fairness, predictability, and confidentiality.

---

# Fairness Guarantees

The scheduler guarantees:

- No node can monopolize routing,
- No nodlr can influence scheduling,
- No founder can influence scheduling,
- No region can dominate globally,
- No entity can manipulate performance scoring.

Fairness is enforced algorithmically, not by policy.

---

# Anti‑Centralization Design

The scheduling model prevents centralization by:

- Prioritizing locality,
- Using performance‑based scoring,
- Enforcing compliance,
- Avoiding global node visibility,
- Preventing node‑to‑node communication,
- Ensuring identity immutability.

Large operators cannot suppress smaller ones.

Small operators cannot game the system.

---

# Retry Scheduling

If a job fails:

- A new node is selected,
- A new session is created,
- New ephemeral keys are used,
- Locality is re‑evaluated,
- Performance scores are updated.

Retries are always clean and stateless.

---

# Scheduling Under Load

During high load:

- Locality preference remains,
- Performance scoring becomes more influential,
- Lower‑class nodes receive more micro‑jobs,
- Higher‑class nodes receive more complex workloads,
- No node is overloaded.

The scheduler adapts without changing pricing or identity.

---

# Scheduling Under Market Conditions

The scheduler may adjust routing patterns when:

- Market rates shift,
- Node density changes,
- Regional demand spikes,
- Special pricing tiers are active.

These adjustments:

- Never override fairness,
- Never override compliance,
- Never override confidentiality.

Scheduling adapts, but rules remain immutable.

---

# Confidentiality in Scheduling

The scheduler never sees plaintext.

Scheduling decisions are based solely on:

- Metadata,
- Performance,
- Locality,
- Compliance.

Nodes never see:

- Client identity,
- Job semantics,
- Other nodes.

Scheduling preserves confidentiality by design.

---

# Summary

Compute scheduling ensures:

- Locality‑optimized routing,
- Performance‑based fairness,
- Class‑appropriate workload distribution,
- Compliance‑driven filtering,
- Resource‑aware assignment,
- Resilience under load,
- Adaptation to market conditions,
- Confidentiality preservation,
- Anti‑centralization guarantees.

Scheduling is deterministic, fair, and secure — by architecture, not by trust.
