# Space Node Integration Guide

## Overview
This guide defines the integration path for aerospace and institutional partners deploying the Wnode Space Node client. Integration is designed to be frictionless, environment-agnostic, and completely headless.

## What Partners Receive (The Payload Bundle)
Upon agreement and internal provisioning via the Wnode Command center, partners receive a secure Payload Bundle. This archive contains:
1. **The Space Node Binary:** A streamlined, headless executable compiled for the partner's target architecture (e.g., `linux-amd64`, `linux-arm64`).
2. **Configuration File (`config.json`):** A pre-signed payload containing:
   - The assigned `WUID`
   - The `AA:SP` archetype declaration
   - A secure, long-lived `auth_token`
   - Strict endpoint routing for the Wnode orchestrator and telemetry ingestors.

## What Partners Must Provide
Because Space Nodes deploy into highly proprietary aerospace environments, partners maintain total control over execution. Partners must provide:
- **Execution Environment:** The host OS or container runtime capable of executing the binary.
- **Process Management:** The mechanism to start, stop, and ensure the continuous uptime of the daemon (e.g., systemd, Kubernetes, proprietary RTOS supervisors).
- **Network Access:** Unfettered outbound HTTP/WSS access to the defined Wnode endpoints.

## Authentication Flow
Space Node authentication requires zero human interaction:
1. The node boots and reads `config.json`.
2. The `auth_token` is attached to all outbound requests as a Bearer token (`Authorization: Bearer <token>`).
3. The Wnode orchestrator validates the token, identifying the specific `WUID` and `AA:SP` archetype before authorizing connections.

## Telemetry Flow
Once authenticated, the node enters an automated heartbeat loop. Every cycle (default 30 seconds), it submits a minimal JSON payload to the Wnode Telemetry Endpoint. This payload contains only critical health data (uptime, resource utilization, tasks completed).

## Earnings Summaries
Space Node does not manage its own ledger. During every successful telemetry heartbeat, the Wnode backend calculates base compute earnings and uptime bonuses. The backend responds to the heartbeat with an `earningsSummary` object. The Space Node may log this summary locally for the partner's internal tracking, but all authoritative financial settlements occur strictly on the Wnode backend.

## Open Installation & Deployment
Wnode explicitly does not enforce a specific installation script, package manager, or CI pipeline. Partners are free to bake the binary and `config.json` into base satellite images, orchestrate them via Kubernetes, or deploy them via proprietary OTA (Over-The-Air) update mechanisms. 

## Security & Compliance
- **Read-Only Operation:** The node executes workloads and reports metrics; it cannot mutate network state or access broader mesh data.
- **Token Rotation:** `auth_token` compromise can be instantly mitigated via the Wnode Command center by revoking the specific `WUID` session.
- **Data Minimization:** No PII, corporate metadata, or organizational hierarchy data is ever transmitted by the node.
