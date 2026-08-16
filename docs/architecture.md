# Wnode Enterprise Architecture Specification — arc42 System Specification


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode Enterprise Architecture Specification — arc42 System Specification** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



> **Version:** Wnode Core Architecture v1.1.0  

> **Status:** `Production Ready`  

> **Determinism Profile:** Bare-Metal Go Binary Execution (`nodld`) + Ephemeral RAM Sandboxing  

> **Capability Set:** Native Go System Daemons (97-98% Workloads), SECCOMP Sandbox Native Go Sandbox (2-3% Edge Fallback)  

> **Supported Networks:** Bare-Metal Linux Node Operators (PM2 / Systemd Managed)  

> **Adapter Hash:** `4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b`  

> **Last Updated:** 2026-08-15  

---

## 2. Overview
The Wnode Sovereign Compute Mesh is a deterministic, high-throughput compute substrate. It executes immutable, signed system workloads natively in Go (`nodld` / `nodl-core`) directly on bare-metal host Linux environments (accounting for 97-98% of all mesh compute), while utilizing WebAssembly (`seccomp-sandbox`) as a localized, air-gapped sandbox for untrusted tenant compute (2-3% of edge execution). Wnode eliminates Docker containers entirely to minimize virtualization overhead and guarantee low-latency, zero-storage execution.

## 3. Rationale
Containerized execution engines (e.g. Docker, Podman) introduce significant daemon overhead, slow cold-start latencies (>500ms), non-deterministic filesystem persistence risks, and kernel vulnerability attack surfaces. Wnode adopts a Go-native bare-metal system daemon model (`nodld`) managed directly by `systemd` or `pm2`. Workloads are decrypted directly in volatile RAM, executed in capability-scoped memory spaces, and purged immediately upon completion, guaranteeing zero storage retention and microsecond cold starts.

## 4. Flow (Architecture & Transaction Lifecycle)
![Wnode Canon Architecture Diagram](/diagrams/global-architecture.png)

1. **Ingress Validation:** Clients submit cryptographically signed job envelopes. The stateless orchestrator layer validates ingress headers against active epoch routing tables.
2. **Ephemeral RAM Decryption:** The bare-metal `nodld` daemon receives encrypted chunks and decrypts them exclusively in volatile RAM. No job data touches persistent disk.
3. **Execution Routing:** Standard system tasks and high-performance compute execute natively in compiled Go. Multi-tenant edge tasks execute inside air-gapped `seccomp-sandbox` Native Go instances.
4. **Buffer Purge & Telemetry:** Upon completion, job buffers are zero-overwritten in RAM, an Ed25519-signed telemetry proof is anchored to the Source of Truth (SOT) ledger, and results are returned over encrypted mTLS channels.

## 5. Core Code & API Surface

### Go Core Daemon Main Entrypoint (`nodld/cmd/nodld/main.go`)
![Wnode Canon Architecture Diagram](/diagrams/global-architecture.png)

## 11. References & Sources
- **Daemon Source Path:** `file:///home/obregan/Documents/nodl/nodld/cmd/nodld/main.go`
- **Native Compute Runner:** `file:///home/obregan/Documents/nodl/nodld/internal/runner/`
- **Native Go Runtime Package:** `file:///home/obregan/Documents/nodl/nodld/internal/native-go/`
- **UI Design System:** `file:///home/obregan/Documents/nodl/docs/UI_DESIGN_SYSTEM.md`
