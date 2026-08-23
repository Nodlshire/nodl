# 10 — Cross-Platform Unification Layer (CPUL)

`VERIFIED_BY_TELEMETRY`

The **Cross-Platform Unification Layer (CPUL)** normalizes execution interfaces across Headless Linux, macOS, and Windows WSL2 environments.

---

## 📊 Architecture & Workflow

![CPUL Flowchart](/assets/illustrations/integrations/cpu-unification-flow.svg)

### Key Capabilities
- **Unified Binary Interface**: Zero-dependency binary distribution for Linux, macOS, and WSL2.
- **Hardware Abstraction**: Uniform telemetry, CPU core discovery, and VRAM memory measurement across platforms.
- **Auto-Handshake Protocol**: Standardized p2p gossip protocol connecting disparate OS nodes into one unified mesh.

---

## 🔌 API Endpoints & Daemon Hooks

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/cpul/info` | Return host platform information, architecture, and core counts. |
| `GET` | `/api/cpul/metrics` | Stream unified hardware metrics across all active OS adapters. |

---

## 🖥️ Operator Setup Examples

### Headless Linux
```bash
# Verify Linux system integration
./nodld --cpul-check
```

### macOS
```bash
# Launch Darwin host adapter
./nodld --platform=darwin
```

### Windows WSL2
```bash
# Launch WSL2 host adapter with bridged networking
./nodld --platform=wsl2 --bridge=eth0
```
