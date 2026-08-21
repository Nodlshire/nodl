# Wnode DeWi Operator UI Panel (OUDP) — User & Integration Guide


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode DeWi Operator UI Panel (OUDP) — User & Integration Guide** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



> **Version:** DeWi OUDP v1.0.0  

> **Status:** `Production Ready`  

> **Determinism Profile:** Dark Glassmorphic Design Token Compliant  

> **Capability Set:** 11-State Monitoring, FRCL Control, TX Kill-Switch, SOT Lineage Tree  

> **Supported Networks:** Monitored Compute Mesh / Standalone Node  

> **Adapter Hash:** `8f9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f`  

> **Last Updated:** 2026-08-15  

---

## 2. Overview
The Operator UI DeWi Panel (OUDP) (`apps/command/app/dewi/page.tsx`) provides operators with a real-time, state-driven command dashboard for managing decentralized wireless adapters. It renders 11-state lifecycle badges, real-time telemetry metrics, regional RF compliance selectors, global emergency kill-switch controls, and an interactive cryptographic proof lineage chain inspector.

## 3. Rationale
Managing distributed radio hardware requires total transparency into system state and quick access to emergency overrides. OUDP adheres strictly to Wnode's unified dark glassmorphic design system (`docs/UI_DESIGN_SYSTEM.md`), ensuring zero hidden UI states, clear error indications, and immediate visual feedback when engaging safety controls.

## 4. Flow (Architecture & Transaction Lifecycle)
![Wnode Canon Architecture Diagram](/diagrams/global-architecture.png)

## 11. References & Verifiable Sources
- **UI Page Component:** `file:///home/obregan/Documents/nodl/apps/command/app/dewi/page.tsx`
- **Sidebar Component:** `file:///home/obregan/Documents/nodl/apps/command/app/components/Sidebar.tsx`
- **UI Design System:** `file:///home/obregan/Documents/nodl/docs/UI_DESIGN_SYSTEM.md`
