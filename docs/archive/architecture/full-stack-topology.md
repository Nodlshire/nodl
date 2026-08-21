# Wnode Sovereign Mesh — Full-Stack Architecture & Topology

The Wnode Sovereign Mesh is built upon a decoupled, high-performance microservices architecture. It pairs an autonomous native Go daemon (`nodld`) with four specialized Next.js user interface control planes, zero-trust mTLS telemetry pipes, and multi-protocol DeWi physical network adapters.

![Wnode Full-Stack System Topology Architecture](/diagrams/full_stack_system_topology.png)

---

## 1. Process Management & System Port Assignment

The sovereign node environment orchestrates six distinct daemon processes managed locally via PM2. Each daemon enforces strict security boundaries, isolated domain cookies, and dedicated port bindings:

### Control Planes & Backend Daemons

- **Web Portal & Documentation Suite (`web`)** — **Port 3004**  
  *Primary Ingress*: Public landing portal, interactive documentation reader, enterprise whitepapers, and brand collateral.
- **DeWi Mesh Topology Monitor (`mesh`)** — **Port 3003**  
  *Network Plane*: Real-time peer-to-peer mesh topology visualizer tracking packet routing, link quality (RSSI/SNR), and multi-protocol DeWi transport states.
- **Node Operator Control Center (`nodlr`)** — **Port 3002**  
  *Operator Plane*: Dedicated dashboard for hardware operators to manage node compute allocation, track real-time earnings, configure smart idle detection, and link financial payout channels.
- **Master Admin & CRM Control Center (`command`)** — **Port 3001**  
  *Admin Plane*: Restricted management console for global fleet monitoring, CRM customer cards, geographic telemetry heatmaps, and founder override controls.
- **Core Native Daemon (`nodld`)** — **Port 8080**  
  *Backbone Engine*: Compiled `linux-amd64` Go substrate executing the single-source-of-truth key-value database (`BBolt`), 11-state AI autonomy machine, SECCOMP sandbox, and gRPC/REST APIs.
- **Cloudflare Zero-Trust Tunnel (`cloudflared`)** — **Dynamic Port**  
  *Ingress Tunnel*: Secure encrypted reverse proxy tunnel establishing outbound mTLS connections to live web endpoints without exposing local open ports to the public internet.

### Network Topology Port Summary

| Application / Service Daemon | Target Port | Protocol | Access Scope | Primary Operational Responsibility |
| :--- | :---: | :---: | :--- | :--- |
| **`web`** (Next.js 15) | `3004` | HTTP / WS | Public | Main landing portal, interactive doc engine, investor relations |
| **`mesh`** (Next.js 15) | `3003` | HTTP / WS | Network | DeWi packet routing monitor, link health, P2P topology map |
| **`nodlr`** (Next.js 15) | `3002` | HTTP / WS | Operator | Node operator dashboard, financial ledgers, hardware vitals |
| **`command`** (Next.js 15) | `3001` | HTTP / WS | Admin | Master fleet orchestration, CRM customer cards, global mesh map |
| **`nodld`** (Native Go) | `8080` | gRPC / REST | Internal | Core engine, BBolt SSOT persistence, SECCOMP job execution |
| **`cloudflared`** | Dynamic | mTLS | Tunnel | Zero-Trust outbound proxy shielding internal port endpoints |

---

## 2. Core Go Backend Substrate (`nodld`)

The `nodld` backend binary serves as the sovereign foundation of every node. It runs natively under Linux SECCOMP syscall filters and manages four core technical subsystems:

### Subsystem Architecture

1. **BBolt Single-Source-of-Truth Persistence (`state/engine.db`)**  
   Disk-backed, ACID-compliant key-value store maintaining node identity keys, operator balances, CRM records, hardware capabilities, and historical work scores.

2. **11-State Autonomous Lifecycle Engine**  
   Deterministic state machine evaluating node health every 10 seconds. Dynamically updates trust scores, manages automatic recovery, and triggers downtime slashing or quarantine.

3. **Multi-Protocol DeWi Physical Adapters (`internal/dewi`)**  
   Native drivers bridging physical radio and network interfaces:
   - **Reticulum**: Low-bandwidth P2P mesh transport over TCP `4001` & WebSockets `4002`.
   - **Meshtastic**: Serial interface driver operating on `/dev/ttyUSB0` (915MHz / 868MHz LoRa).
   - **Semtech LoRaWAN**: UDP `1700` packet forwarder & MQTT ingress pipeline.
   - **APRS AX.25**: TNC packet audio decoder bound to `/dev/ttyS1`.

4. **SECCOMP Sandboxed Workload Execution**  
   Hardened execution environment executing pre-compiled Go and WASM workloads under restricted Linux cgroups and syscall limits.

---

## 3. Domain Security & Authorization Boundaries

Identity tokens are strictly scoped across domain boundaries to enforce complete separation of concerns:

| Auth Token Type | Target Scope / Domain | Required Authorization Level | Security & Access Privilege |
| :--- | :--- | :--- | :--- |
| `cmd_session` | `command` (`:3002`) | Admin Role | Complete fleet control, CRM modifications, system settings |
| `nodlr_session` | `nodlr` (`:3003`) | Operator Role | Node hardware management, earning ledgers, schedule config |
| `mesh_session` | `mesh` (`:3001`) | Network Role | P2P topology telemetry monitoring & packet inspector |
| `Authorization` | `Bearer <device>` | Device Hardware | Monotonic heartbeat ingestion & telemetry signature validation |
| `X-Owner-ID` | `100001-0426-01-AA` | Founder Master Key | Immutable protocol-level emergency bypass & root authority |

---

## 4. End-to-End Telemetry Ingestion Flow

![Wnode Sovereign Mesh End-to-End Telemetry Pipeline Flow](/diagrams/hyper_scale_ingestion_pipeline.png)

1. **Node Device Ingestion**: Node hardware generates binary Protobuf telemetry envelopes signed with device private keys.
2. **Bearer Token Validation**: Ingest gateways verify device signatures against the cached SSOT registry.
3. **SSOT Update**: `nodld` updates heartbeat timestamps and work scores atomically in `state/engine.db`.
4. **Event Bus Broadcast**: Real-time telemetry events push to Command Center (`:3002`) and Nodlr (`:3003`) dashboards simultaneously over mTLS WebSockets.
