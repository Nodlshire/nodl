# Wnode Sovereign Compute Mesh — Headless Operator Technical Specification

**Version**: 1.7  
**Author**: Wnode Protocol Engineering Group  
**Document Standard**: IEEE / Academic Protocol Specification  

---

## 1. Executive Overview

The **Wnode Headless Operator** (`nodl-core`) is a zero-GUI, high-performance background daemon engineered for deployment on headless Linux servers, cloud VPS instances, edge compute nodes, Raspberry Pi, and containerized infrastructure.

Unlike GUI desktop nodes, the Headless Operator executes without display servers, Webview dependencies, or desktop environment wrappers. It communicates directly with the Wnode Mesh Orchestration API via authenticated TLS telemetry channels.

---

## 2. CLI Command & Flag Matrix

```text
nodl-core [FLAGS] [COMMANDS]
```

| Flag / Option | Environment Variable | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `--token` | `WNODE_AUTH_TOKEN` | *None* | Headless registration token (`REG-...`) or device token. |
| `--api-base` | `WNODE_API_BASE` | `https://nodlr.wnode.one` | Canonical Wnode Mesh Orchestrator URL. |
| `--upid` | `WNODE_UPID` | *Auto-Generated* | Unique Universal Provider Identifier for node identity. |
| `--cpu-limit` | `WNODE_CPU_LIMIT` | `0` (Unrestricted) | Maximum CPU cores allocated for mesh workloads. |
| `--ram-limit` | `WNODE_RAM_LIMIT` | `0` (Unrestricted) | Maximum RAM limit (in GB) for RAM-isolated tasks. |
| `--port` | `WNODE_PORT` | `28443` | Internal RPC/telemetry management port. |
| `--no-browser` | `WNODE_NO_BROWSER` | `true` | Forces pure daemon execution mode without GUI triggers. |

---

## 3. Quickstart Installation Commands

### A. One-Line Linux Headless Daemon Setup (x86_64 / amd64)

```bash
curl -L https://github.com/wnodeltd/wnode/releases/download/v1.0.3/nodl-core-linux-amd64 -o nodl-core \
  && chmod +x nodl-core \
  && WNODE_API_BASE=https://nodlr.wnode.one ./nodl-core --token=REG-YOUR-HEADLESS-TOKEN-HERE
```

### B. ARM64 / Raspberry Pi / Edge Compute Setup

```bash
curl -L https://github.com/wnodeltd/wnode/releases/download/v1.0.3/nodl-core-linux-arm64 -o nodl-core \
  && chmod +x nodl-core \
  && WNODE_API_BASE=https://nodlr.wnode.one ./nodl-core --token=REG-YOUR-HEADLESS-TOKEN-HERE
```

---

## 4. Production Systemd Service Unit Template

To run `nodl-core` as a persistent system-level daemon that auto-starts on boot and self-heals after crashes or reboots, create `/etc/systemd/system/wnode-headless.service`:

```ini
[Unit]
Description=Wnode Sovereign Compute Mesh Headless Operator
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=wnode
Group=wnode
WorkingDirectory=/opt/wnode
ExecStart=/opt/wnode/nodl-core --token=REG-YOUR-HEADLESS-TOKEN-HERE --api-base=https://nodlr.wnode.one --no-browser
Restart=always
RestartSec=5
LimitNOFILE=65536
LimitNPROC=65536

[Install]
WantedBy=multi-user.target
```

### Enabling and Starting the Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable wnode-headless
sudo systemctl start wnode-headless
sudo systemctl status wnode-headless
```

---

## 5. Docker Container Deployment

### `Dockerfile`

```dockerfile
FROM alpine:3.19
RUN apk add --no-cache ca-certificates curl libc6-compat
WORKDIR /app
RUN curl -L https://github.com/wnodeltd/wnode/releases/download/v1.0.3/nodl-core-linux-amd64 -o /app/nodl-core \
    && chmod +x /app/nodl-core
ENV WNODE_API_BASE="https://nodlr.wnode.one"
ENTRYPOINT ["/app/nodl-core", "--no-browser"]
```

### `docker-compose.yml`

```yaml
version: '3.8'

services:
  wnode-operator:
    image: wnodeltd/nodl-core:latest
    container_name: wnode-headless-operator
    restart: unless-stopped
    environment:
      - WNODE_API_BASE=https://nodlr.wnode.one
    command: ["--token=REG-YOUR-HEADLESS-TOKEN-HERE"]
    network_mode: host
```

---

## 6. Headless Token Consumption Protocol & API Specifications

When a headless operator initializes with a single-use registration token (`REG-...`), it executes the following API handshake protocol:

### Token Consumption Flow

```
┌───────────────────────────┐                      ┌──────────────────────────┐
│   Headless Node Client    │                      │  Wnode Mesh Orchestrator │
│       (nodl-core)         │                      │    (api.wnode.one)       │
└─────────────┬─────────────┘                      └────────────┬─────────────┘
              │                                                 │
              │  1. POST /api/v1/nodes/headless-token/consume   │
              │  Authorization: Bearer REG-xxxx                 │
              │  Body: {"upid": "...", "cpuCores": 8}           │
              ├────────────────────────────────────────────────>│
              │                                                 │
              │  2. Response: 200 OK                            │
              │  {"deviceToken": "8c75f7...", "status": "active"}│
              │<────────────────────────────────────────────────┤
              │                                                 │
              │  3. Save deviceToken locally & Start Heartbeats │
              │  POST /api/v1/nodes/heartbeat                   │
              │  Authorization: Bearer 8c75f7...                │
              ├────────────────────────────────────────────────>│
```

#### API Endpoint Definition

* **Endpoint**: `POST /api/v1/nodes/headless-token/consume`
* **Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer REG-a4dc95e8-d178-42f3-84d8-fb36030d786d
  ```
* **Request Body**:
  ```json
  {
    "token": "REG-a4dc95e8-d178-42f3-84d8-fb36030d786d",
    "upid": "UPID-FEDORA-001",
    "cpuCores": 8,
    "memoryGb": 16
  }
  ```
* **Response (HTTP 200 OK)**:
  ```json
  {
    "deviceToken": "8c75f71d-935d-495e-8d0f-01357d4673cd",
    "nodeId": "HN-2fc37770",
    "status": "connected"
  }
  ```

---

## 7. Diagnostics & Logging

> [!IMPORTANT]
> Headless operators store persistent state in `~/.nodl/state.json`. To inspect real-time daemon logs, use `journalctl` or direct stdout tailing.

```bash
# View real-time daemon logs
journalctl -u wnode-headless -f -o cat

# Manually verify API reachability
curl -v https://api.wnode.one/health
```
