# Node Compliance

## Overview
Node compliance defines the mandatory rules every node must follow to participate in the wnode network.  
Compliance ensures:

- Confidentiality,
- Zero‑storage enforcement,
- RAM‑only execution,
- Integrity of the runtime,
- Fair routing,
- Anti‑centralization,
- Constitutional behavior.

This document defines node compliance without repeating compute classes, routing instructions, or node lifecycle details covered elsewhere.

---

# Compliance Principles

Node compliance is built on seven immutable principles:

1. **Zero‑storage**
2. **RAM‑only execution**
3. **Swap disabled**
4. **Runtime integrity**
5. **Attestation (A+ only)**
6. **Update currency**
7. **Transparent reporting**

These principles cannot be bypassed or weakened.

---

# Compliance Surface

Nodes must comply with:

- Storage rules,
- Execution rules,
- Environment rules,
- Attestation rules (A+),
- Update rules,
- Behavioral rules,
- Reporting rules.

Compliance is continuous — not a one‑time check.

---

# 1. Zero‑Storage Compliance

Nodes must:

- Never write job data to disk,
- Never write decrypted data to disk,
- Never write encrypted data to disk,
- Never write ephemeral keys to disk,
- Never create temporary files,
- Never use persistent caches.

Zero‑storage is constitutional.

Violations result in immediate suspension.

---

# 2. RAM‑Only Execution Compliance

Nodes must:

- Decrypt payloads only in RAM,
- Execute workloads only in RAM,
- Store intermediate results only in RAM,
- Destroy all buffers after use,
- Destroy ephemeral keys after use.

RAM execution ensures:

- No persistence,
- No forensic recovery,
- No long‑term exposure.

---

# 3. Swap Disabled

Nodes must:

- Disable swap,
- Disable paging,
- Prevent memory‑mapped files,
- Prevent disk‑backed buffers.

Swap usage is a zero‑tolerance violation.

If swap is detected:

- The node is suspended,
- The nodlr is notified,
- The violation is logged.

---

# 4. Runtime Integrity

Nodes must maintain:

- Unmodified runtime binaries,
- Unmodified kernel (unless allowed),
- Unmodified OS integrity,
- No unauthorized processes,
- No side‑channel tools.

Runtime integrity ensures:

- Confidentiality,
- Predictability,
- Trustworthiness.

Integrity failures trigger suspension.

---

# 5. Attestation (A+ Nodes)

A+ nodes must:

- Pass hardware attestation,
- Pass environment attestation,
- Provide valid signatures,
- Maintain enclave integrity (if present),
- Re‑attest after updates.

Attestation failures downgrade A+ → A or suspend the node.

---

# 6. Update Currency

Nodes must:

- Run the latest steward‑approved version,
- Apply security patches promptly,
- Re‑attest after updates (A+),
- Re‑confirm compliance after updates.

Out‑of‑date nodes:

- Become inactive,
- Cannot receive jobs,
- Must remediate before reactivation.

---

# 7. Transparent Reporting

Nodes must report:

- Heartbeats,
- Performance metrics,
- Stability metrics,
- Compliance status,
- Version information,
- Attestation status (A+).

Reports contain no plaintext or identity.

---

# Compliance Verification

The steward verifies compliance through:

- Heartbeat analysis,
- Runtime integrity checks,
- Attestation verification (A+),
- Zero‑storage enforcement signals,
- RAM‑execution confirmation,
- Swap detection,
- Behavioral anomaly detection,
- Update version checks.

Verification is continuous and automatic.

---

# Compliance and Routing

Compliance is the first routing filter.

Routing order:

1. **Compliance**
2. Locality
3. Performance score
4. Compute class
5. Resource availability

Non‑compliant nodes receive **zero jobs**.

---

# Compliance and Compute Classes

Compliance determines:

- Eligibility for Class A,
- Eligibility for Class A+,
- Downgrades,
- Suspensions.

A+ requires:

- Perfect compliance,
- Hardware attestation,
- Environment attestation.

Compliance is the foundation of class assignment.

---

# Compliance Violations

Violations include:

- Disk writes,
- Swap usage,
- Runtime modification,
- Attestation failure,
- Out‑of‑date runtime,
- Unauthorized processes,
- Behavioral anomalies.

Violations trigger:

- Immediate suspension,
- Performance score reset,
- Nodlr notification,
- Steward logging.

Violations are reversible only after remediation.

---

# Compliance and Confidentiality

Compliance ensures:

- No plaintext exposure,
- No persistence,
- No key leakage,
- No forensic recovery,
- No cross‑job contamination.

Confidentiality is preserved by architecture.

---

# Compliance and Anti‑Centralization

Compliance prevents centralization by:

- Enforcing uniform rules,
- Preventing privileged nodes,
- Preventing large operators from bypassing constraints,
- Ensuring fair routing,
- Ensuring predictable behavior.

No operator can “opt out” of compliance.

---

# Summary

Node compliance ensures:

- Zero‑storage,
- RAM‑only execution,
- Swap disabled,
- Runtime integrity,
- Attestation (A+),
- Update currency,
- Transparent reporting,
- Fair routing,
- Confidentiality preservation.

Compliance is  constitutional.
