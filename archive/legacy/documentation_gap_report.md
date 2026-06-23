# Documentation Gap Report: Wnode Enterprise Technical Audit

This report evaluates the current state of `docs/enterprise_technical_audit.md` against the total codebase footprint of the `wnodeltd/wnode` repository to identify missing subsystems, undocumented components, and incomplete execution flows.

---

## 1. Subsystem Classification Matrix

| Subsystem | Audit Status |
|---|---|
| `nodld` backend | Partially documented (Missing auxiliary packages like `contact`, `acquisition`, `institutional`) |
| mesh client | Partially documented |
| node operator (native) | Present in repo but missing from audit (Distinction between native vs. browser execution flows) |
| Space Node (headless/satellite) | Present in repo but missing from audit |
| portals (cmd, operator, governance, investor, nodlr) | Partially documented (Governance and Investor specifics missing) |
| integrations (all 616) | Partially documented (Broadly classified as scaffold-only, but missing `integration.json` schema details) |
| WASM sandbox | Fully documented |
| distributed engine | Fully documented |
| job lifecycle + scheduler + sharding | Fully documented |
| identity, registry, ledger | Fully documented |
| libp2p host + networking | Partially documented (Missing `network/gater.go` edge cases and connection limits) |
| security (JWT, auth, compliance, hardening) | Mentioned but incomplete |
| governance + DAO contracts | Fully documented |
| deployment (docker-compose, workflows) | Partially documented |
| persistence model | Fully documented |
| telemetry + metrics | Present in repo but missing from audit (`TelemetryDispatcher` flow) |
| failure modes | Mentioned but incomplete |
| configuration + environment | Mentioned but incomplete (`config/config.go` structs) |

---

## 2. Missing Subsystems & Code-Level Details

### 2.1 Space Node Architecture
- **Gap**: The entire Space Node ("AA:SP" Archetype) infrastructure is undocumented.
- **Required Files**: `nodld/internal/account/model.go` (Archetype enum), `nodld/internal/institutional/service.go`.
- **Required Details**: How satellite operators attest hardware, bypass standard WebRTC NAT checks, and schedule high-priority tasks.

### 2.2 Telemetry & Metrics Pipeline
- **Gap**: Passive telemetry ingestion is absent from the audit.
- **Required Files**: `nodld/internal/account/telemetry.go`.
- **Required Details**: The `TelemetryDispatcher` background queue, non-blocking channel behavior (`chan *TelemetryEvent`), and the HTTP client payload structures sent to the Command Centre.

### 2.3 User Acquisition & Contact Systems
- **Gap**: CRM and lead generation backend services are undocumented.
- **Required Files**: `nodld/internal/contact/handler.go`, `nodld/internal/contact/store.go`, `nodld/internal/acquisition/service.go`.
- **Required Details**: How `CRMRecord` structs are persisted and queried.

### 2.4 Authentication & Session Management
- **Gap**: Security section mentions JWT/Magic Links generically but lacks code-level precision.
- **Required Files**: `nodld/internal/api/auth.go`, `nodld/internal/account/store.go`.
- **Required Details**: `InviteToken`, `MagicLinkToken`, and `DomainSession` structs. The exact verification flow for domain-scoped sessions and RBAC enforcement (`Role` enum checking).

### 2.5 Native vs. Browser Node Execution
- **Gap**: The daemon does not differentiate clearly between a native Go CLI worker (`wnoder`) and a browser-based worker (`nodlr`).
- **Required Files**: `nodld/internal/runner/worker.go` vs WebAssembly/browser constraints.
- **Required Details**: How `DeviceClass` ("native" vs "wasm") affects scheduling and Sybil scanning.

---

## 3. Missing Execution Paths & Data Flows

### 3.1 Telemetry Dispatch Flow
- **Missing Flow**: The exact path of `TelemetryEvent` creation -> `td.queue` channel buffering -> background `send()` HTTP POST.
- **Action**: Add a sequence diagram mapping `Publish()` to the async HTTP dispatch.

### 3.2 Magic Link Authentication Flow
- **Missing Flow**: Generation of UUID magic links, email delivery (or log fallback), and session token redemption.
- **Action**: Document state transitions in `MagicLinkToken`.

### 3.3 Space Node Institutional Intake
- **Missing Flow**: How an institutional partner requests onboarding via `apps/web/about/space-mesh` and how `nodld/internal/institutional/handler.go` processes the request.
- **Action**: Add execution flow detailing the bypass of standard organic signup limits.

---

## 4. Missing Diagrams

1. **Authentication & Session Lifecycle Diagram**: Mapping Magic Links, Session creation, and RBAC middleware validation.
2. **Telemetry Ingestion Diagram**: Mapping `TelemetryEvent` generation across subsystems (Identity, Ledger, DistributedEngine) into the `TelemetryDispatcher` channel.
3. **Native vs. Browser Worker Diagram**: Contrasting WebRTC/WebTransport browser connectivity with raw TCP native daemon connectivity.
4. **Space Node Institutional Pipeline**: Diagramming the satellite intake, specialized SLA provisioning, and API isolation.

---

## 5. Missing Failure Modes & Edge Cases

- **Telemetry Queue Saturation**: What happens when `make(chan *TelemetryEvent, 1000)` fills up? (Code drops events silently; this must be explicitly documented).
- **Environment Variable Fallbacks**: Detailed behavior of `config.Load()` when `.env` is missing or `STRIPE_SECRET_KEY` is absent (Service stubs logic but allows local dev).
- **State File Corruption**: Behavior if `state/engine.json` is truncated or contains malformed JSON during boot (Fatal crash vs recovery).

---

## 6. Action Plan for Final Refinement

To elevate the audit to absolute completeness, the next iteration must inject:
1. The `TelemetryDispatcher` subsystem.
2. The complete `api/auth.go` session and JWT structures.
3. The Space Node (`AA:SP`) institutional onboarding pipeline.
4. Native vs Browser device class scheduling differentials.
5. Exact error handling logic for config loading, state parsing, and telemetry channel saturation.
6. The 4 missing diagrams listed above.
