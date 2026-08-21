# System Architecture Overview

**Version**: 1.7  
**Architecture Model**: arc42 Standard  

---

## 1. High-Level System Layers

The Wnode architecture is organized into five operational layers:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. COMPUTE BUYER / AGENT LAYER (USD API Requests & Payment Rails)       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. SOVEREIGN AI ORCHESTRATOR LAYER (MoE Workload Routing Engine)       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                  ┌──────────────────┴──────────────────┐
                  ▼                                     ▼
┌──────────────────────────────────┐  ┌──────────────────────────────────┐
│ 3. CMD TELEMETRY INGESTION       │  │ 4. PROPRIETARY NODE MESH         │
│ (Zero-Synthetic Telemetry Engine)│  │ (nodld RAM-Only Execution)       │
└──────────────────────────────────┘  └──────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 5. VERIFICATION, ATTESTATION & USD YIELD SETTLEMENT ENGINE              │
└─────────────────────────────────────────────────────────────────────────┘
```

1. **Compute Buyer / Agent Layer**: Exposes USD-denominated REST/gRPC endpoints for autonomous AI agents, enterprise clients, and smart contracts.
2. **Sovereign AI Orchestrator Layer**: Dynamically matches incoming workload envelopes with optimal compute node tiers based on CPU, RAM, latency, and geographic constraints.
3. **CMD Telemetry Pipeline**: Enforces a strict zero-synthetic telemetry policy, epoch-based heartbeat routing, and hardware challenge verification ($L_{\text{mem}}$).
4. **Proprietary Node Mesh (`nodld`)**: Lightweight native daemon running in un-swappable RAM namespaces with zero disk persistence.
5. **Settlement & Governance Engine**: Processes operator payouts in USD/USDC while executing WWEX token staking, slashing, and Soul-DAO voting routines.
