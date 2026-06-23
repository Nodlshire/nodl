# Node Lifecycle

## Overview
The node lifecycle defines the complete journey of a node in the wnode network — from creation to retirement.  
It ensures:

- Identity immutability,
- Compliance enforcement,
- Confidentiality preservation,
- Predictable behavior,
- Safe failure modes,
- Transparent state transitions.

This document defines the node lifecycle without repeating scheduling, routing, compute classes, or governance details covered elsewhere.

---

# Lifecycle Stages

A node progresses through eight stages:

1. **Creation**
2. **Fingerprinting**
3. **Registration**
4. **Activation**
5. **Operation**
6. **Update**
7. **Suspension (if needed)**
8. **Retirement**

Each stage is deterministic and steward‑verified.

---

# 1. Creation

A node is created when:

- A nodlr installs the node software,
- The runtime initializes,
- The hardware environment is detected.

During creation:

- No identity exists yet,
- No jobs can be received,
- No network privileges are granted.

Creation is local and offline.

---

# 2. Fingerprinting

Fingerprinting establishes the node’s **permanent identity**.

The fingerprint includes:

- Hardware identifiers,
- CPU characteristics,
- TPM/TEE measurements (if available),
- OS integrity signals,
- Runtime integrity signals.

Fingerprinting ensures:

- Nodes cannot impersonate each other,
- Nodes cannot be cloned,
- Nodes cannot churn identities.

The fingerprint is immutable for the life of the node.

---

# 3. Registration

Registration binds the node to:

- A nodlr,
- A founder tree,
- A lineage.

During registration, the steward:

- Verifies the fingerprint,
- Creates a permanent node identity,
- Assigns an initial compute class,
- Records compliance metadata.

Nodes cannot change owners or lineage after registration.

---

# 4. Activation

A node becomes active when:

- Registration is complete,
- Compliance checks pass,
- Zero‑storage is confirmed,
- RAM‑only execution is confirmed,
- Swap is disabled,
- Updates are current.

Activation grants:

- Eligibility for routing,
- Eligibility for scheduling,
- Eligibility for performance scoring.

Inactive nodes cannot receive jobs.

---

# 5. Operation

During operation, a node:

- Receives routing instructions,
- Executes jobs in RAM,
- Returns encrypted results,
- Wipes all buffers,
- Maintains compliance,
- Reports performance metrics.

Operation is stateless:

- No job data persists,
- No keys persist,
- No results persist.

Operation continues until:

- Updates are required,
- Compliance changes,
- Hardware changes,
- The node is suspended or retired.

---

# 6. Update

Nodes must update when:

- The steward publishes a new runtime,
- Security patches are required,
- Compliance rules change,
- Attestation requirements change.

During update:

- The node becomes temporarily inactive,
- The steward verifies the new runtime,
- Environment attestation may be required (A+),
- Compliance is re‑evaluated.

Updates cannot modify:

- Identity,
- Lineage,
- Economics.

Updates may modify:

- Performance scoring logic,
- Locality inference,
- Compliance checks,
- Runtime behavior.

---

# 7. Suspension

Nodes may be suspended when:

- Compliance fails,
- Zero‑storage is violated,
- RAM execution is violated,
- Swap is detected,
- Hardware fingerprint changes,
- Attestation fails (A+),
- Malicious behavior is detected.

Suspension effects:

- Node receives no jobs,
- Performance score drops to zero,
- Nodlr is notified,
- Steward logs the event.

Suspension is reversible after remediation.

---

# 8. Retirement

A node is retired when:

- The nodlr decommissions it,
- Hardware fails permanently,
- The node is replaced,
- The nodlr leaves the network.

Retirement effects:

- Node identity is archived,
- Lineage remains intact,
- No new jobs are assigned,
- No state persists.

Retired nodes cannot be reactivated.

---

# Safe Failure Modes

Nodes fail safely because:

- All data is in RAM,
- All keys are ephemeral,
- No disk writes occur,
- No persistence exists.

If a node crashes:

- All job data is lost,
- All keys are lost,
- No confidentiality is compromised.

Failure is a confidentiality guarantee.

---

# Node Lifecycle and Confidentiality

Confidentiality is preserved at every stage:

- Fingerprinting reveals no user data,
- Registration stores no plaintext,
- Activation enforces zero‑storage,
- Operation uses RAM‑only execution,
- Updates cannot weaken confidentiality,
- Suspension protects against violations,
- Retirement leaves no recoverable traces.

Confidentiality is architectural, not optional.

---

# Node Lifecycle and Anti‑Centralization

The lifecycle prevents centralization by:

- Enforcing immutable identity,
- Preventing identity churn,
- Preventing node impersonation,
- Enforcing compliance uniformly,
- Preventing privileged nodes,
- Ensuring fair routing.

Large operators cannot manipulate lifecycle transitions.

---

# Summary

The node lifecycle ensures:

- Immutable identity,
- Immutable lineage,
- Safe activation,
- RAM‑only operation,
- Zero‑storage enforcement,
- Transparent updates,
- Fair suspension,
- Safe retirement,
- Confidentiality preservation.
