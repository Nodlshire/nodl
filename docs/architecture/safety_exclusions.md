# Wnode Security Safety Exclusions — Technical Specification


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode Security Safety Exclusions — Technical Specification** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



> **Version:** Safety Exclusions v1.1.0  

> **Status:** `Production Ready`  

> **Determinism Profile:** Hardware-Level Capability Exclusions & Zero-Disk Rules  

> **Capability Set:** Process Isolation, Storage Blacklisting, Syscall Seccomp Filtering  

> **Supported Networks:** Bare-Metal Linux Node Operators (PM2 / Systemd)  

> **Adapter Hash:** `2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3`  

> **Last Updated:** 2026-08-15  

---

## 2. Overview
The Wnode Security Safety Exclusions specification defines prohibited syscalls, hardware access exclusions, and zero-storage enforcement rules binding all bare-metal Go node daemons (`nodld`). It guarantees that no compute workload can access physical host storage, manipulate host network interfaces, or bypass capability-scoped I/O boundaries.

> [!NOTE]

> **Dynamic Integration Rollout Notice:** Advanced eBPF-based real-time syscall enforcement profiles are rolling out dynamically.

## 3. Rationale
Multi-tenant compute execution on bare-metal node hardware requires absolute isolation guarantees. Safety Exclusions use Linux `seccomp-bpf` filters and cgroup namespaces to block dangerous system calls (e.g. `reboot`, `mount`, direct raw socket creation) while restricting data operations exclusively to volatile RAM.

## 4. Flow (Syscall Interception Flow)
```
[Compute Task Syscall] ➔ [seccomp-bpf Filter Gate] ➔ ALLOW (RAM Operation) OR KILL (Prohibited Disk/Syscall)
```

## 5. Core Code & API Surface
```go
package compute

type SafetyRule struct {
	SyscallName string `json:"syscallName"`
	Action      string `json:"action"` // "ALLOW", "KILL", "TRAP"
}
```

## 6. Failure Modes & Error Handling
- `ERR_SAFETY_PROHIBITED_SYSCALL`: Task attempted blacklisted syscall; process killed immediately.

## 7. Invariants & Guarantees
- Zero disk writes allowed.
- Zero raw socket manipulation allowed without explicit DeWi adapter permissions.

## 8. Telemetry & Observability
- Security violations logged to `/tmp/ui-core-migration/reports/logs/tx_events.jsonl`.

## 9. Security & Audits
- Audited seccomp filters block raw kernel exploit primitives.

## 10. Canonical Diagrams & Schemas
```
Task ➔ seccomp Filter ➔ Permitted RAM Syscall / Blocked Disk Syscall
```

## 11. References & Sources
- **Security Specification:** `file:///home/obregan/Documents/nodl/docs/SECURITY.md`
- **Node Contract:** `file:///home/obregan/Documents/nodl/docs/NODE_CONTRACT.md`
