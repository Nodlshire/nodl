# Wnode Enterprise Architecture Specification

The Wnode Sovereign Mesh is a deterministic, verifiable, auto-scaling compute substrate.  
It executes immutable, signed WASM and Go artifacts across a decentralized network of operators.  
The architecture enforces sovereign compute guarantees through deterministic execution, capability-scoped I/O, stateless orchestration, and cryptographically signed telemetry.

---

## Global Architecture Overview

Wnode is composed of three constitutional layers:

### **1. Stateless Orchestrator Layer**
- ingress validation  
- routing epoch distribution  
- mTLS telemetry sink  
- no execution responsibilities  
- horizontally scalable, zero SPOF  

### **2. Earth Mesh (Tier‑1)**
- synchronous execution  
- native Go + WASM  
- local ingress validation  
- capability-scoped I/O  
- deterministic execution  

### **3. Space Mesh (Tier‑3)**
- asynchronous MapReduce  
- sharded workloads  
- edge/off-grid operators  
- deterministic reduction  

---

## Global Architecture Diagram

![Global Architecture Diagram](/diagrams/global-architecture.png)

This diagram shows:
- orchestrator layer  
- Earth Mesh  
- Space Mesh  
- ingress validation  
- routing epoch distribution  
- telemetry sink  

---

## Execution Sequence Flow

1. Client sends an HMAC-signed request.  
2. Node validates ingress using cached routing epoch.  
3. Node executes WASM payload with strict capability enforcement.  
4. Node emits cryptographically signed telemetry envelope.  
5. Node returns encrypted execution result to the client.

---

## Execution Flow Diagram

![Execution Flow Diagram](/diagrams/execution-flow.png)

---

## Core Artifacts

### **spec.yaml**
Declarative manifest defining:
- capabilities  
- bindings  
- resource limits  
- deterministic configuration  

### **Generated Go Handler**
Strict execution boundary enforcing:
- timeouts  
- cgroups  
- capability validation  
- panic trapping  
- RAM-only execution  

### **WASM Runtime (Wazero)**
Provides:
- deterministic memory model  
- air-gapped sandbox  
- zero-retention semantics  
- capability-scoped host functions  

### **Capability Registry**
Daemon-side enforcer of:
- outbound I/O restrictions  
- deterministic host-function mapping  
- spec.yaml bindings  

### **Routing Epoch Structure**
Signed payload containing:
- allowed routes  
- ingress validation rules  
- HMAC secrets  
- deterministic routing tables  

---

## Core Architecture Diagram

![Core Artifacts Diagram](/diagrams/core-artifacts.png)

---

## Failure Modes & Safety Boundaries

- epoch expiration  
- capability rejection  
- WASM sandbox traps  
- grace-based reputation decay  
- offline operation  
- telemetry delivery failure  

All failure modes are deterministic, safe, and cryptographically accountable.

---

## Security Invariants

- deterministic execution  
- zero custody  
- zero retention  
- capability-scoped I/O  
- signed artifacts  
- signed telemetry  
- deterministic routing  

These invariants cannot be bypassed.

---

## Performance Characteristics

- ingress validation: <1ms  
- WASM cold start: <10ms  
- capability overhead: <2ms  
- epoch refresh: asynchronous, off critical path  

---

## Responsibilities

### Operator
- maintain uptime  
- protect identity keys  
- ensure cgroups and sandboxing  

### Developer
- define accurate spec.yaml  
- declare capabilities explicitly  
- write deterministic WASM logic  

---

## Telemetry Emission

Telemetry is:
- cryptographically signed  
- mTLS-secured  
- monotonic-countered  
- zero-retention  

No plaintext logs are ever emitted.
