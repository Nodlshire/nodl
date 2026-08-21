# Steward Update Policy

## Overview
The Steward Update Policy defines how the steward may update its own logic, runtime, and enforcement rules.  
It ensures that updates:

- Preserve constitutional constraints,
- Maintain fairness,
- Maintain confidentiality,
- Maintain economic neutrality,
- Remain transparent and auditable,
- Never modify identity or lineage,
- Never modify founder or nodlr rights.

This document defines the update policy without repeating governance, compute classes, or node lifecycle details covered elsewhere.

---

# Update Principles

All steward updates must follow eight principles:

1. **Constitutional Integrity**
2. **Transparency**
3. **Versioning**
4. **Backward Compatibility**
5. **Non‑Interference in Economics**
6. **Non‑Interference in Identity**
7. **Security First**
8. **Auditability**

These principles cannot be overridden.

---

# 1. Constitutional Integrity

Updates must not:

- Modify identity rules,
- Modify lineage rules,
- Modify founder economics,
- Modify override percentages,
- Modify confidentiality guarantees,
- Modify zero‑storage or RAM execution requirements.

Updates may:

- Improve enforcement,
- Improve performance,
- Improve routing,
- Improve compliance checks.

The constitution is immutable.

---

# 2. Transparency

All updates must be:

- Publicly logged,
- Versioned,
- Documented,
- Announced.

The steward may not:

- Apply silent updates,
- Hide rule changes,
- Introduce opaque behavior.

Transparency ensures trust.

---

# 3. Versioning

Every update must include:

- A version number,
- A change log,
- A migration summary,
- A rollback plan.

Versioning ensures:

- Predictability,
- Auditability,
- Reproducibility.

Nodes must report their version to the steward.

---

# 4. Backward Compatibility

Updates must:

- Avoid breaking existing nodes,
- Provide compatibility windows,
- Allow staged rollout,
- Allow safe fallback.

Backward compatibility ensures:

- Stability,
- Fairness,
- Network continuity.

Breaking changes require explicit migration phases.

---

# 5. Non‑Interference in Economics

Updates may not modify:

- Nodlr earnings formulas,
- Founder override percentages,
- Founder rights,
- Lineage,
- Tree boundaries.

Updates may modify:

- Market monitoring logic,
- Incentive timing (not percentages),
- Performance scoring formulas.

Economics are constitutional.

---

# 6. Non‑Interference in Identity

Updates may not modify:

- Node identity,
- Nodlr identity,
- Founder identity,
- Lineage assignments.

Updates may modify:

- Fingerprinting methods (additive only),
- Attestation requirements,
- Compliance checks.

Identity is immutable.

---

# 7. Security First

Updates must prioritize:

- Confidentiality,
- Zero‑storage enforcement,
- RAM‑only execution,
- Attestation integrity,
- Anti‑tampering protections.

Security updates may:

- Override backward compatibility,
- Trigger mandatory node updates,
- Trigger temporary suspensions.

Security is paramount.

---

# 8. Auditability

Updates must:

- Be logged,
- Be reproducible,
- Be independently verifiable,
- Include cryptographic signatures.

Audit logs must include:

- Version number,
- Timestamp,
- Change summary,
- Steward signature.

Auditability prevents abuse.

---

# Update Lifecycle

The steward follows a strict update lifecycle:

1. **Draft**
2. **Internal validation**
3. **Compatibility testing**
4. **Security review**
5. **Version assignment**
6. **Public announcement**
7. **Staged rollout**
8. **Full enforcement**
9. **Audit logging**

Each stage is mandatory.

---

# Node Update Requirements

Nodes must:

- Update within the required window,
- Pass compliance checks after update,
- Re‑attest (A+ nodes),
- Confirm zero‑storage and RAM execution.

Nodes that fail to update:

- Become inactive,
- Cannot receive jobs,
- Are flagged for remediation.

Updates cannot weaken confidentiality.

---

# Emergency Updates

Emergency updates may occur when:

- A security vulnerability is discovered,
- A compliance rule is compromised,
- A critical bug affects confidentiality.

Emergency updates must still:

- Be versioned,
- Be logged,
- Preserve constitutional constraints.

Emergency updates may bypass staged rollout.

---

# Rollback Policy

Rollbacks must:

- Restore the previous version,
- Preserve identity and lineage,
- Preserve economics,
- Preserve logs.

Rollbacks may not:

- Modify constitutional constraints,
- Modify founder rights,
- Modify override flow.

Rollbacks are logged and auditable.

---

# Steward Neutrality

Updates must not:

- Favor specific nodes,
- Favor specific nodlrs,
- Favor specific founders,
- Introduce privileged behavior.

Neutrality is constitutional.

---

# Summary

The Steward Update Policy ensures:

- Constitutional integrity,
- Transparency,
- Versioning,
- Backward compatibility,
- Economic neutrality,
- Identity immutability,
- Security first,
- Full auditability.

The steward may evolve wnode,  
but never beyond its constitutional limits.
