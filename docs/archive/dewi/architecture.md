# Wnode DeWi Subsystem Architecture — arc42 Specification


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode DeWi Subsystem Architecture — arc42 Specification** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



> **Version:** DeWi Subsystem v1.0.0  

> **Status:** `Production Ready`  

> **Determinism Profile:** Cryptographically Verified (Ed25519 + SHA-256 Lineage Chained)  

> **Capability Set:** Multi-Protocol Abstraction (Reticulum, Meshtastic, LoRaWAN, APRS)  

> **Supported Networks:** Monitored Compute Mesh / Standalone Node  

> **Adapter Hash:** `8f9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f`  

> **Last Updated:** 2026-08-15  

---

## 2. Overview
The Wnode Decentralized Wireless (DeWi) subsystem provides a deterministic, secure, multi-protocol hardware abstraction layer for long-range radio frequency (RF) networks. It normalizes packet ingestion, validates regional RF regulations (EU868, US915, AS923), enforces a 6-layer transmission safety framework with a global kill switch, and anchors all packet telemetry and lifecycle state transitions into an append-only Source of Truth (SOT) cryptographic lineage ledger.

## 3. Rationale
Heterogeneous RF hardware (Semtech LoRa gateways, ESP32 Meshtastic radios, Reticulum packet nodes, APRS TNCs) suffers from non-deterministic timestamps, vendor-specific byte orderings, floating-point drift, and unsafe transmission risks. Wnode DeWi resolves these issues by inserting a strict Go-native abstraction layer (`nodld/internal/dewi/`) between raw hardware serial/UDP sockets and the Wnode compute mesh, enforcing canonical JSON serialization, fixed numeric precision, Ed25519 operator signing, and zero-trust transmission gates.

## 4. Flow (Architecture & Transaction Lifecycle)
![Wnode Canon Architecture Diagram](/diagrams/global-architecture.png)

1. **Ingestion & Capability Extraction:** Raw frames are ingested via native serial/UDP sockets. `HCEL` extracts hardware revision, firmware version, and supported bands.
2. **Telemetry Normalization:** `TSE` maps protocol fields to canonical units (Hz, mV, °C, dBm) and rounds float fields (`snr_db` to 1 decimal, `channel_utilization` to 3 decimals).
3. **Compliance Validation:** `FRCL` checks frequencies and duty cycle against `RegionProfile`. Non-compliant frames transition the adapter to `StateError`.
4. **Lineage Chaining & Signing:** `DPSI` computes SHA-256 payload hashes, appends `previous_proof_id`, increments `lineage_depth`, computes rolling `lineage_hash`, and signs using Ed25519 operator private keys.
5. **Ingestion & Settlement:** Signed proofs are passed via `proofChan` to revenue settlement (`70% Operator / 20% Platform / 10% Affiliate`) and exposed over Fiber HTTP `/api/v1/dewi/*`.

## 5. Core Code & API Surface

### Go Core Interface (`nodld/internal/dewi/adapter_core.go`)
![Wnode Canon Architecture Diagram](/diagrams/global-architecture.png)

## 11. References & Verifiable Sources
- **Source Code Repository:** `file:///home/obregan/Documents/nodl/nodld/internal/dewi/`
- **Specification Document:** `Wnode DeWi Full Technical Specification v1.0`
- **UI System Guide:** `file:///home/obregan/Documents/nodl/docs/UI_DESIGN_SYSTEM.md`
