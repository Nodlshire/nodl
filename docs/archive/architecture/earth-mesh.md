# Wnode Architecture — Earth Mesh (Tier‑1)


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode Architecture — Earth Mesh (Tier‑1)** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



The Earth Mesh is Wnode’s Tier‑1 deterministic execution layer.  
It provides synchronous, high‑assurance compute using native Go handlers and Native Go modules, enforced by strict capability boundaries and cryptographically verifiable ingress.

Earth Mesh nodes operate independently, validating ingress locally using signed routing epochs and executing workloads inside a deterministic, zero‑retention sandbox.

---

## Earth Mesh Overview Diagram

![Earth Mesh Overview](/diagrams/earth-mesh-overview.png)

This diagram shows:
- Earth Mesh nodes  
- local ingress validation  
- Native Go execution boundary  
- capability registry  
- telemetry emission  
- orchestrator interaction (routing epochs + telemetry sink)

---

## Core Responsibilities of Earth Mesh Nodes

### **1. Local Ingress Validation**
Earth Mesh nodes validate all incoming requests using:
- cached routing epochs  
- HMAC secrets  
- deterministic routing tables  

This ensures:
- zero SPOF  
- offline operation  
- cryptographic authenticity  
- deterministic ingress behavior  

### **2. Deterministic Native Go Execution**
Nodes execute Native Go modules inside a SECCOMP Sandbox sandbox with:
- deterministic memory model  
- air‑gapped isolation  
- zero‑retention semantics  
- capability‑scoped host functions  

### **3. Capability Enforcement**
All outbound I/O is validated against:
- spec.yaml declarations  
- daemon-side capability registry  
- deterministic host-function boundaries  

Unauthorized operations trap instantly.

### **4. Telemetry Emission**
Nodes emit:
- cryptographically signed envelopes  
- monotonic sequence counters  
- deterministic execution metadata  
- mTLS-secured transport  

Telemetry is never stored locally.

---

## Earth Mesh Execution Flow Diagram

![Earth Mesh Execution Flow](/diagrams/earth-mesh-flow.png)

This diagram illustrates:
1. Signed request → node  
2. Local ingress validation  
3. Native Go execution  
4. Capability enforcement  
5. Telemetry emission  
6. Encrypted result return

---

## Execution Characteristics

Earth Mesh provides:
- **<1ms** ingress validation latency  
- **<10ms** Native Go cold start  
- **<2ms** capability overhead  
- deterministic replayability  
- zero-custody security  
- zero-retention execution  

These characteristics make Earth Mesh suitable for:
- synchronous workloads  
- high-assurance compute  
- deterministic pipelines  
- low-latency applications  

---

## Earth Mesh Safety Boundaries

Earth Mesh enforces:
- deterministic execution  
- capability-scoped I/O  
- signed artifacts  
- signed telemetry  
- RAM-only execution  
- zero retention  
- zero custody  

If any invariant is violated:
- execution halts deterministically  
- no partial results are emitted  
- no state is retained  

---

## Earth Mesh vs Orchestrator

Earth Mesh nodes:
- execute workloads  
- validate ingress  
- enforce capabilities  
- emit telemetry  

The orchestrator:
- publishes routing epochs  
- receives telemetry  
- never executes workloads  
- never performs scheduling  

This separation ensures:
- zero SPOF  
- sovereign compute  
- deterministic routing  
- global scalability  
