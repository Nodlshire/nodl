# 02 — REST API & WebSocket Telemetry Reference

`VERIFIED_BY_TELEMETRY`

The Wnode API Reference documents REST v1 endpoints and real-time WebSocket telemetry streams powering `nodld` and `cmd.wnode.one`.

---

## 📡 Telemetry Data Flow

![WebSocket Telemetry Flowchart](/assets/illustrations/api-telemetry/websocket-flow.svg)

---

## ⚙️ Daemon REST Endpoints

### 1. GET `/api/v1/nodes/status`
- **Method**: `GET`
- **Domain**: `⚙️ Daemon`
- **SDK Equivalent**: [`TelemetryClient.getNodeStatus()`](https://wnode.one/docs/sdk/api-reference#getNodeStatus)
- **Response Payload**:
  ```json
  {
    "status": "online",
    "uptime_seconds": 184920,
    "cores": 8,
    "ram_total_gb": 32,
    "payout_status": "active"
  }
  ```

### 2. POST `/api/v1/mesh/update`
- **Method**: `POST`
- **Domain**: `📡 Telemetry`
- **SDK Equivalent**: [`MeshManager.updateMesh()`](https://wnode.one/docs/sdk/api-reference#updateMesh)
- **Request Payload**:
  ```json
  {
    "peer_id": "12D3KooW...",
    "action": "announce",
    "dewi_mode": "active"
  }
  ```

### 3. POST `/api/v1/soe/tune`
- **Method**: `POST`
- **Domain**: `⚙️ Daemon`
- **SDK Equivalent**: [`SOEEngine.tuneRAM()`](https://wnode.one/docs/sdk/api-reference#tuneRAM)
- **Request Payload**:
  ```json
  {
    "ram_cap_mb": 4096,
    "target_efficiency": 0.98
  }
  ```

### 4. POST `/api/v1/jobs/submit`
- **Method**: `POST`
- **Domain**: `🧩 SDK`
- **SDK Equivalent**: [`WasmRunner.submitJob()`](https://wnode.one/docs/sdk/api-reference#submitJob)
- **Request Payload**:
  ```json
  {
    "envelope_id": "env_994821",
    "wasm_hash": "a8f3b...",
    "timeout_ms": 5000
  }
  ```
