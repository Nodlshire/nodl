# Wnode Full-Stack System Topology & Component Architecture

This document provides a comprehensive end-to-end master reference of all components across the Wnode Sovereign Mesh platform: UI applications, backend services, DeWi protocol adapters, single-source-of-truth storage, and security identity boundaries.

---

## 1. Process & Network Port Topology

The platform comprises 6 core daemons coordinated via PM2 process management:

```
+-----------------------------------------------------------------------------------+
|                              SYSTEM PORT MAP & DAEMONS                             |
+-------------------+----------+----------------------------------------------------+
| Application / SVC | Port     | Description & Primary Responsibility               |
+-------------------+----------+----------------------------------------------------+
| web (Next.js)     | 3004     | Main landing portal, doc reader, layman graphics   |
| nodlr (Next.js)   | 3003     | Node operator dashboard, sales, finances, hardware |
| command (Next.js) | 3002     | Master admin control plane, CRM, global fleet map  |
| mesh (Next.js)    | 3001     | DeWi network topology & telemetry monitor          |
| backend (nodld)   | 8080     | Core Go daemon, SSOT store, API server, runtime    |
| cloudflared       | Variable | Secure reverse proxy tunnel to live web endpoints  |
+-------------------+----------+----------------------------------------------------+
```

---

## 2. Core Go Backend Substrate (`nodld`)

The `nodld` binary runs natively on `linux-amd64` and encapsulates five subsystem layers:

```
+-----------------------------------------------------------------------------------+
|                             NODLD BACKEND DAEMON CORE                             |
|                                                                                   |
|  +---------------------+   +---------------------+   +-------------------------+  |
|  | Single Source of    |   | Autonomy Engine     |   | DeWi Multi-Protocol     |  |
|  | Truth (BBolt DB)    |   | (11-State Machine)  |   | Transports              |  |
|  | engine.db / .json   |   | Trust/Health/Slashing|   | Reticulum/Meshtastic... |  |
|  +----------+----------+   +----------+----------+   +------------+------------+  |
|             |                         |                           |               |
|             +-------------------------+---------------------------+               |
|                                       |                                           |
|                                       v                                           |
|                        +--------------+--------------+                            |
|                        | SECCOMP Native Sandbox       |                            |
|                        | (Go & WASM Job Runtime)     |                            |
|                        +-----------------------------+                            |
+-----------------------------------------------------------------------------------+
```

### Key Subsystems
1. **BBolt SSOT Persistence**: Disk-backed key-value store (`state/engine.db` / `state/engine.json`) holding Nodlr accounts, CRM customer cards, node hardware mappings, and earnings ledgers.
2. **Autonomous Self-Healing Lifecycle**: 11-State machine evaluating node SLA uptime every 10 seconds. Manages trust scores, downtime penalization, and slashing.
3. **DeWi Protocol Adapters (`internal/dewi`)**:
   - **Reticulum**: TCP 4001, WS 4002 P2P transport.
   - **Meshtastic**: `/dev/ttyUSB0` serial interface.
   - **LoRaWAN**: Semtech UDP 1700 / MQTT forwarder.
   - **APRS**: `/dev/ttyS1` AX.25 TNC decoder.
4. **SECCOMP Restricted Native Sandbox**: Hardened Go runtime executing binary jobs under restricted Linux syscall filters.

---

## 3. Domain Security & Authentication Matrix

Identity is strictly scoped across domain boundaries to prevent cross-portal session hijacking:

```
+-------------------+--------------------+---------------------------------------+
| Auth Token Type   | Scope / Domain     | Target Authorization                  |
+-------------------+--------------------+---------------------------------------+
| cmd_session       | "command"          | Full Admin & CRM Access               |
| nodlr_session     | "nodlr"            | Operator Portal & Hardware Management |
| mesh_session      | "mesh"             | P2P Mesh Topology Monitor             |
| Authorization     | "Bearer <device>"  | Node Heartbeats & Telemetry Ingest    |
| X-Owner-ID        | "100001-0426-01-AA"| Authoritative Founder Bypass          |
+-------------------+--------------------+---------------------------------------+
```

---

## 4. End-to-End Data Pipeline Flow

```
[ Node Operator Device ] --(Heartbeat)--> [ POST /api/v1/nodes/heartbeat ]
                                                     |
                                                     v
                                       [ Require Device Bearer Token ]
                                                     |
                                                     v
                                       [ UpdateNodeHeartbeat in SSOT ]
                                                     |
                                                     v
                                       [ Publish Telemetry Event Bus ]
                                                     |
                                    +----------------+----------------+
                                    |                                 |
                                    v                                 v
                        [ Command Centre UI: 3002 ]       [ Nodlr UI: 3003 ]
                        [ Global Fleet Map ]              [ Hardware Cards ]
```
