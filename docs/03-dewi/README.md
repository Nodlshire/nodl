# DeWi (Decentralized Wireless) Subsystem

**Version**: 1.7  
**Status**: First-Class Protocol Subsystem  

The **DeWi Subsystem** integrates decentralized wireless transceivers (LoRaWAN gateways, CBRS small cells, and 5G micro-transceivers) into the Wnode Sovereign Compute Mesh.

---

## Subsystem Architecture
DeWi radio gateways operate as specialized Tier 5 compute nodes within the Wnode mesh. They perform local packet processing, RF spectrum telemetry attestation, and wireless data relaying directly inside RAM-isolated execution contexts.

```
DeWi Radio Transceiver (LoRaWAN / CBRS) ──► Hardware Abstraction Layer (HAL)
                                                    │
                                                    ▼
                                          nodld DeWi Transceiver Plugin
                                                    │
                                                    ▼
                                       CMD Wireless Telemetry Engine
```

### Module Index
- [`architecture.md`](./architecture.md): DeWi Subsystem Architecture & Frequency Spectrum
- [`protocols.md`](./protocols.md): Wireless Protocols (LoRaWAN, CBRS, 5G Micro-Cell)
- [`radio-safety.md`](./radio-safety.md): RF Exposure Limits & Regulatory Compliance
- [`hardware-abstraction.md`](./hardware-abstraction.md): Radio Gateway Hardware Abstraction Layer (HAL)
- [`integration-with-mesh.md`](./integration-with-mesh.md): Integrating DeWi Telemetry with Wnode Mesh
