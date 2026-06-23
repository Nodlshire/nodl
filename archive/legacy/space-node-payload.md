# Space Node Payload Design

## Overview
To onboard aerospace partners, Wnode generates a pre-configured, standalone payload. This payload contains everything required for the partner to integrate the Space Node into their satellite or ground-station infrastructure. 

## Payload Composition
The payload is typically delivered as a bundled archive (e.g., `.tar.gz`) or a minimal container image, containing the core headless binary and a static configuration file.

### Configuration Bundle
The generated configuration file (e.g., `config.json` or `config.yaml`) securely encapsulates the node's identity and connection parameters:
- **WUID:** The pre-generated Wnode Unique Identifier.
- **Archetype:** Hardcoded to `AA:SP` to ensure the orchestrator routes appropriate space-tier workloads.
- **Authentication:** Cryptographic keys or JWT tokens for initial handshake with the Auth Endpoint.
- **Endpoints:** Pre-populated URLs for the Orchestrator, Telemetry, and Auth services, ensuring the node connects to the correct Wnode environments (e.g., production vs. staging).

## Generation Workflow
1. **Provisioning (Wnode Command):** A Wnode administrator creates the partner's Nodlr account.
2. **Placement:** The Space Node instance is placed into the appropriate position within the Command affiliate tree.
3. **Export:** Command generates the specific payload bundle containing the node's unique `WUID` and pre-signed auth tokens.
4. **Delivery:** The payload is securely transmitted to the partner.

## Installation & Deployment
- **Agnostic Deployment:** Because partners possess highly customized and proprietary operating environments (e.g., real-time OS on satellite hardware), Wnode does not dictate the installation method.
- **Execution:** The partner is responsible for unpacking the payload, placing the configuration file in the expected directory, and configuring their system's process manager (e.g., systemd, custom init scripts) to execute the headless binary.
