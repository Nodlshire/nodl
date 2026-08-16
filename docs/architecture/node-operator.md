# Node Operator


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Node Operator** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



The Node Operator is the unified execution surface of the Wnode sovereign compute mesh. Every platform including Windows, macOS, Linux, Android, and Space Mesh, wraps the same deterministic nodl-core binary, ensuring identical execution semantics regardless of hardware, operating system, or physical environment. The Node Operator is the exclusive entry point for all module execution. It enforces deterministic compute (no host nondeterminism), capability-bounded I/O (HTTP, DB, GPU, FS, Native Go), Routing Epoch governance (capability maps, profile selection, telemetry routing), and deterministic replay pipelines. All Node Operator variants have desktop, headless, Android support for both Earth Mesh and Space Mesh profiles. The profile simply changes the active Routing Epoch and capability map whilst  execution semantics remain identical.

## Download & Installation

### Desktop (UI)
- **Windows:** Download the `.exe` binary.
- **macOS:** Download the universal `.app` bundle (Intel + ARM).
- **Linux:** Download the `.AppImage` or native binary.

The desktop UI is built using Fyne, a pure-Go cross-platform toolkit. It has zero external dependencies and wraps `nodl-core` without introducing nondeterministic host behavior.

### Headless (Daemon)
- **Linux:** Install via `systemd` service definition.
- **macOS:** Install via `launchd` plist.
- **Windows:** Install via `winsw` service wrapper.

Headless mode is ideal for servers, mini-PCs, and persistent nodes.

### Android
Install the `.apk` directly. The Android Node Operator uses Go Mobile bindings + JNI to run `nodl-core` as a background service.

### Space Mesh Profile
Space Mesh is not a separate binary. It is activated via the profile flag `--profile=space` or the equivalent JNI initialization argument.

## Desktop UI Node Operator

The Desktop Node Operator provides a native graphical interface built using Fyne. It does not execute modules; it orchestrates the lifecycle of the underlying `nodl-core` daemon.

### Responsibilities
- Launch / terminate `nodl-core`
- Display Mesh status (Earth / Space)
- Display active Routing Epoch
- Render capability map (HTTP, DB, GPU, FS, Native Go)
- Show deterministic execution state
- Toggle replay mode
- Stream telemetry and logs in real time

Determinism is enforced inside `nodl-core`, not the UI. The UI simply reflects the engine state.

![Desktop UI Node Operator](/diagrams/node-operator-desktop-ui.png)

## Headless Node Operator

Headless mode runs `nodl-core` as a background daemon, integrated directly into the host OS.

### Service Integration
- **Linux:** `systemd`
- **macOS:** `launchd`
- **Windows:** `winsw`

### CLI Flags
- `--profile=<earth|space>`
- `--epoch=<override>`
- `--capabilities=<override>`
- `--replay`

### Deterministic Execution Loop
Headless mode executes the same deterministic loop as desktop mode: capability enforcement, Routing Epoch governance, forbidden syscall traps, deterministic replay pipelines, and telemetry emission.

### Observability
- Local health endpoint
- stdout/stderr telemetry
- Log ingestion into external observability systems

![Headless Node Operator Architecture](/diagrams/node-operator-headless-architecture.png)

## Android Node Operator

The Android Node Operator runs the same `nodl-core` binary using Go Mobile bindings, a JNI bridge, and a minimal Kotlin UI surface.

### Architecture
- Background service runs `nodl-core`
- Kotlin UI displays status, Epoch, capabilities
- Battery-aware pause/resume signals
- Identical telemetry pipeline to desktop/headless

### Space Mesh Support
Android supports Earth Mesh and Space Mesh identically. Space Mesh is activated via `--profile=space`, JNI initialization arguments, or `space.config.json`.

![Android Mobile Execution and Space Mesh Connectivity](/diagrams/node-operator-android-space.png)

## Space Mesh Profile

Space Mesh is a profile, not a separate runtime.

### Defined by
- `space.config.json`
- Space-specific Routing Epochs
- Space capability maps
- Space telemetry endpoints

### Execution Semantics
Execution is mathematically identical to Earth Mesh: same deterministic engine, same replay pipelines, same capability enforcement, same telemetry hashing. All Node Operator variants support Space Mesh.

## Cross-Platform Execution Summary

### Desktop
- Windows
- macOS
- Linux

### Headless
- Windows (`winsw`)
- macOS (`launchd`)
- Linux (`systemd`)

### Mobile
- Android (Go Mobile + JNI)

### Profiles
- Earth Mesh
- Space Mesh (any platform)

### Unified Guarantees
- Same `nodl-core` deterministic engine
- Same capability boundaries
- Same Routing Epoch governance
- Same telemetry and replay semantics
- Same execution fidelity everywhere

The Node Operator is the single, unified, sovereign execution surface for Wnode.
