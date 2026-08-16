# Wnode DeWi Frequency & Region Compliance Layer (FRCL) — Technical Specification


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode DeWi Frequency & Region Compliance Layer (FRCL) — Technical Specification** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



> **Version:** DeWi FRCL v1.0.0  

> **Status:** `Production Ready`  

> **Determinism Profile:** Pre-Validation Rules & Monotonic Duty-Cycle Tracking  

> **Capability Set:** Region Profiles (EU868, US915, AS923), Duty-Cycle Accounting  

> **Supported Networks:** Monitored Compute Mesh / Standalone Node  

> **Adapter Hash:** `8f9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f`  

> **Last Updated:** 2026-08-15  

---

## 2. Overview
The Frequency & Region Compliance Layer (FRCL) (`nodld/internal/dewi/adapter_compliance.go`) enforces regional radio frequency rules, power output limits, allowed modulation schemes, and duty-cycle transmission caps across all DeWi adapters. An adapter cannot transition from `CapabilitiesNegotiated` to `Ready` without passing FRCL pre-checks.

## 3. Rationale
Radio spectrum usage is strictly regulated by international law (e.g. ETSI in Europe, FCC in the US). Transmitting on unauthorized frequencies or exceeding duty-cycle limits exposes operators to legal liability and causes co-channel interference. FRCL enforces regional compliance deterministically inside `nodld`, preventing unauthorized transmissions before packets ever reach the hardware radio frontend.

## 4. Flow (Architecture & Transaction Lifecycle)
![Wnode Canon Architecture Diagram](/diagrams/global-architecture.png)

## 5. Core Code & API Surface

### Region Profiles & Compliance Validator (`nodld/internal/dewi/adapter_compliance.go`)
```go
package dewi

type RegionBand struct {
	FreqMinHz   int64    `json:"freqMinHz"`
	FreqMaxHz   int64    `json:"freqMaxHz"`
	MaxPowerDbm int      `json:"maxPowerDbm"`
	DutyCycle   float64  `json:"dutyCycle"`
	Modulations []string `json:"modulations"`
}

type RegionProfile struct {
	Region   string       `json:"region"`
	Bands    []RegionBand `json:"bands"`
	Fallback string       `json:"fallback"`
}

type ComplianceResult struct {
	Status          string `json:"status"` // "PASS", "WARNING", "ERROR"
	Reason          string `json:"reason"`
	FrequencyLegal  bool   `json:"frequencyLegal"`
	PowerLegal       bool   `json:"powerLegal"`
	DutyCycleLegal  bool   `json:"dutyCycleLegal"`
	ModulationLegal bool   `json:"modulationLegal"`
}
```

## 6. Failure Modes & Error Handling
- **Illegal Frequency Requested:** `ValidateRF` returns `Status: "ERROR"` with reason `frequency outside regional band bounds`.
- **Power Exceeded:** Proposed dBm exceeds band limit. Rejected instantly.
- **Duty-Cycle Budget Exhausted:** Monotonic tracker denies additional transmission time until window resets.

## 7. Invariants & Guarantees
- **Immutable Regional Profiles:** Pre-configured profiles (`EU868`, `US915`, `AS923`) cannot be bypassed by operator commands.
- **Monotonic Duty-Cycle Accounting:** Transmission durations are tracked in millisecond counters over rolling hourly windows.

## 8. Telemetry & Observability
- Emits compliance status events to `/api/v1/dewi/status`.
- Command UI displays region bounds, legal frequency ranges, and real-time duty-cycle budget percentage.

## 9. Security & Audits
- All compliance pre-check evaluations produce deterministic `ComplianceResult` logs that are recorded prior to TX authorization.

## 10. Canonical Diagrams & Schemas
```json
{
  "region": "EU868",
  "bands": [
    {
      "freqMinHz": 863000000,
      "freqMaxHz": 870000000,
      "maxPowerDbm": 14,
      "dutyCycle": 0.01,
      "modulations": ["FSK", "LoRa"]
    }
  ],
  "fallback": "RX_ONLY"
}
```

## 11. References & Verifiable Sources
- **Compliance Module:** `file:///home/obregan/Documents/nodl/nodld/internal/dewi/adapter_compliance.go`
- **Specification Section:** `Frequency & Region Compliance Layer (Section 7)`
