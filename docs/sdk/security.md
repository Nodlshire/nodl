# Security and Compliance

Security in Wnode is enforced through constitutional constraints, deterministic execution guarantees, and strict zero‑custody rules.  
The SDK must never introduce nondeterminism, state retention, or cryptographic risk.  
All security behavior is explicit, auditable, and reproducible.

---

## Key Handling

Wnode follows a **zero‑custody** key model.

### SDK Key Rules

The SDK must **never**:
- store private keys  
- generate private keys  
- sign payloads  
- sign transactions  
- request keys  
- inspect keys  
- infer keys  
- retain keys  

All cryptographic operations occur **outside** the SDK or **inside** the Steward/mesh under sovereign compute constraints.

### Steward Key Rules

The Steward uses:
- RAM‑only ephemeral keys  
- deterministic key usage semantics  
- zero‑retention key lifecycle  
- non‑exportable key material  

Ephemeral keys:
- never touch disk  
- never persist  
- never leave the execution boundary  
- never become developer-visible  
- never become SDK-visible  

Key handling is strictly internal to sovereign compute.

---

## Data Integrity

Data integrity is enforced through deterministic metadata, reproducible execution, and strict lineage tracking.

### Integrity Guarantees

Wnode guarantees:
- immutable job metadata  
- immutable shard definitions  
- deterministic routing  
- deterministic reduction  
- deterministic verification  
- reproducible lineage  

Integrity cannot rely on:
- timestamps  
- randomness  
- node-specific behavior  
- environment-specific behavior  
- nondeterministic IO  

### Integrity Enforcement

The mesh enforces:
- shard consistency  
- reduction correctness  
- replay equivalence  
- multi-node consensus (if configured)  
- cryptographic proof validation (if configured)  

If any integrity check fails, the job is rejected or flagged.

---

## Sovereign Compute Enforcement

Sovereign compute is enforced through constitutional constraints:

### 1. Zero Custody
No keys, no signing, no private material.

### 2. Zero Retention
No logs, no payloads, no identity retention.

### 3. Zero Visibility
Payloads are sealed and decrypted only inside RAM.

### 4. Deterministic Execution
No randomness, no heuristics, no inference.

### 5. Deterministic Routing
Routing must be reproducible across environments.

### 6. Deterministic Reduction
Reduction must be associative, commutative, and replayable.

### 7. Deterministic Verification
Verification must be mathematically defined and reproducible.

### 8. Immutable Metadata
Metadata cannot be mutated after job creation.

Sovereign compute ensures:
- trustlessness  
- reproducibility  
- auditability  
- constitutional safety  

---

## Validation Checklist

This checklist ensures that a job, SDK usage, and execution path comply with sovereign compute rules.

### Metadata Validation
- All fields explicitly declared  
- No hidden defaults  
- No inferred values  
- No nondeterministic fields  
- Metadata identical across environments  

### Routing Validation
- Routing hints deterministic  
- Region/device class constraints explicit  
- No heuristic routing  
- Deterministic path computable  

### Sharding Validation
- Shard boundaries deterministic  
- Shard count fixed  
- Reduction strategy deterministic  
- No shard divergence  

### Privacy Validation
- Privacy mode explicitly declared  
- Sealed payloads handled correctly  
- Zero-retention constraints respected  
- No payload visibility outside RAM  

### Verification Validation
- Replay produces identical results  
- Reduction output consistent  
- Steward validation passes  
- Optional cryptographic proofs valid  

### Failure Mode Validation
Job must be rejected if:
- metadata nondeterministic  
- routing nondeterministic  
- shard divergence detected  
- reduction nondeterministic  
- replay mismatch occurs  
- privacy mode violated  

This checklist is mandatory for all sovereign compute workloads.

---
