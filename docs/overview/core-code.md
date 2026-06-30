# Wnode Architecture — Core Code

The Wnode Sovereign Mesh is built on a minimal, deterministic, cryptographically verifiable execution core.  
Every component is designed to enforce safety, replayability, and zero‑custody guarantees.

This section defines the canonical artifacts that form the execution boundary of Wnode.

---

## Core Artifacts

### **1. spec.yaml**
The declarative manifest defining:
- required capabilities  
- outbound I/O bindings  
- execution constraints  
- resource limits  
- deterministic configuration  

The spec.yaml is compiled into an immutable artifact.  
Nodes do not interpret configuration dynamically.

---

### **2. Generated Go Handler**
The Go handler is the strict execution boundary between:
- WASM module  
- host capabilities  
- daemon enforcement layer  

It enforces:
- deterministic timeouts  
- cgroup isolation  
- capability validation  
- panic trapping  
- RAM‑only execution  

The handler is generated from spec.yaml and is immutable.

---

### **3. WASM Runtime (Wazero)**
The Wazero sandbox provides:
- deterministic memory model  
- air‑gapped execution  
- zero-retention semantics  
- capability-scoped host functions  
- reproducible behavior across all nodes  

No filesystem.  
No network stack.  
No nondeterministic host behavior.

---

### **4. Capability Registry**
The daemon-side registry enforces:
- outbound I/O restrictions  
- spec.yaml capability declarations  
- deterministic host-function mapping  
- strict boundary checks  

Unauthorized operations instantly trap the WASM module.

---

### **5. Routing Epoch Structure**
Routing epochs are signed payloads containing:
- allowed routes  
- ingress validation rules  
- HMAC secrets  
- deterministic routing tables  

Nodes validate ingress **locally**, without contacting the orchestrator.

---

## Execution Boundary Guarantees

The core code enforces:
- deterministic WASM execution  
- capability-scoped I/O  
- cryptographically signed artifacts  
- RAM-only execution  
- zero-custody security  
- zero-retention semantics  
- deterministic routing  
- deterministic reduction  

These guarantees form the constitutional safety model of Wnode.
