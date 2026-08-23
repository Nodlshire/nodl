# 09 — Self-Optimization Engine (SOE)

`VERIFIED_BY_TELEMETRY`

The **Self-Optimization Engine (SOE)** is Wnode's autonomous runtime tuner for zero-storage RAM compute nodes and DeWi packet relays.

---

## 📊 Architecture & Workflow

![SOE Flowchart](/assets/illustrations/integrations/soe-flow.svg)

### Key Capabilities
- **Dynamic RAM Allocation**: Re-allocates WASM memory buffers based on incoming job workloads.
- **DeWi Packet Routing**: Adjusts LoRaWAN / 5G micro-cell telemetry frequencies according to mesh congestion.
- **Autonomous Telemetry Sync**: Streams heartbeat telemetry directly to `/api/nodes/stats`.

---

## 🔌 API Endpoints & Daemon Hooks

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/soe/status` | Fetch real-time SOE optimization state and RAM usage. |
| `POST` | `/api/soe/tune` | Manually trigger an optimization pass on the local daemon. |
| `WS` | `/ws/telemetry` | WebSocket stream for live SOE metrics and node capacity. |

---

## 🖥️ Operator Setup Examples

### Headless Linux (Ubuntu / Debian / Fedora)
```bash
# Enable SOE in nodld daemon
./nodld --enable-soe --ram-cap=4096MB

# Verify SOE status
curl -s http://localhost:8080/api/soe/status
```

### macOS (Terminal / Homebrew)
```bash
# Start nodld with SOE tuning
nodld --soe-mode=auto --log-level=info
```

### Windows WSL2 (Ubuntu on WSL)
```bash
# Run in background with max memory allocation
export NODE_OPTIONS="--max-old-space-size=4096"
./nodld --enable-soe --wsl2-adapter
```
