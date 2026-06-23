# Space Node Specification

## Overview
Space Node is a headless, lightweight client for the Wnode ecosystem, designed specifically for our aerospace and satellite partners. Unlike the standard Nodlr client, Space Node operates entirely in the background with no graphical user interface (GUI) or dashboard. Its primary purpose is to provide compute and connectivity from space infrastructure, reporting telemetry and accumulating earnings seamlessly.

## Identity Model
Every Space Node is provisioned with a strict, cryptographically secure identity profile:
- **WUID (Wnode Unique Identifier):** The globally unique identifier for the node instance.
- **Archetype:** `AA:SP` (Autonomous Agent: Space Provider) - explicitly classifies the node's origin and operational parameters.
- **Label:** `Nodlr IN` (similar to Mesh IN) - denotes that the node operates within the internal Nodlr network boundary, bypassing public affiliate layers.

## Telemetry & Metrics
Space Node minimizes bandwidth and compute overhead by reporting only essential telemetry to the orchestrator:
- `uptime`: Continuous operational time since the last restart.
- `tasks_completed`: Aggregate count of compute or routing tasks successfully executed.
- `resource_usage`: Current CPU, memory, and bandwidth utilization metrics.
- `earnings`: Real-time accumulation of WND/credits earned via task execution.
- `bonuses`: Additional rewards granted for high availability or specific network demands.

## Required Endpoints
The node communicates strictly with Wnode backend services via secured APIs:
- **Orchestrator Endpoint:** Receives task assignments and orchestrates execution cycles.
- **Telemetry Endpoint:** Periodically pushes heartbeat and health metrics.
- **Auth Endpoint:** Handles secure WUID authentication, token rotation, and archetype validation.

## Headless Run Model
Space Node is built for autonomous, zero-touch operation:
- **No UI:** The client contains no dashboard, frontend, or user interaction layers.
- **Auto-Start:** Designed to initialize immediately upon host system boot.
- **Auto-Report:** Telemetry and heartbeat cycles are automated via background daemons.
- **Partner Managed:** Once the Wnode account is created and the node is placed in the affiliate tree via Command, the Space Node simply runs and reports back. It never interacts with the affiliate system directly.
