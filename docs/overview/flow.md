# Wnode Architecture — Execution Flow

![diagram](/diagrams/flow-sequence.png)

The Wnode Sovereign Mesh executes workloads through a deterministic, cryptographically verifiable sequence.  
Every step is replayable, auditable, and identical across all nodes and environments.

This flow eliminates nondeterministic scheduling, centralized bottlenecks, and opaque routing behavior found in traditional cloud systems.

---

## High-Level Execution Flow

1. **Client → Mesh (Signed Request)**  
   The client sends an HMAC‑signed request containing:
   - immutable payload  
   - declared capabilities  
   - routing constraints  
   - execution parameters  

2. **Node → Local Ingress Validation**  
   The node validates the request using its **locally cached routing epoch**, ensuring:
   - deterministic ingress  
   - zero dependency on orchestrator availability  
   - cryptographic authenticity  

3. **Node → Deterministic WASM Execution**  
   The node executes the WASM artifact inside an air‑gapped Wazero sandbox:
   - deterministic memory model  
   - capability‑scoped host functions  
   - RAM‑only execution  
   - zero retention  

4. **Node → Capability Enforcement**  
   All outbound I/O is validated against:
   - spec.yaml capability declarations  
   - daemon‑side capability registry  
   - strict host‑function boundaries  

   Unauthorized operations instantly trap the WASM module.

5. **Node → Telemetry Emission**  
   The node emits a cryptographically signed telemetry envelope containing:
   - monotonic sequence counter  
   - execution metadata  
   - capability usage  
   - performance metrics  

   Transport is secured via mTLS.

6. **Node → Encrypted Result Return**  
   The node returns the encrypted execution result to the client.  
   No plaintext logs or unsealed data ever leave the sandbox.

---

## Deterministic Flow Guarantees

- Identical execution across all nodes  
- Replayable workloads  
- Verifiable lineage  
- Deterministic routing  
- Deterministic reduction (for sharded workloads)  
- Zero-custody security  
- Zero-retention execution  

This flow is the backbone of Wnode’s sovereign compute model.
