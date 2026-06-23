# Space Node Overview

## Executive Summary
Space Node is an enterprise-grade, headless client explicitly engineered for aerospace and satellite infrastructure partners. It acts as the critical uplink between orbital or remote ground-station hardware and the Wnode Sovereign Mesh. By eliminating graphical user interfaces and public network overhead, Space Node ensures a lightweight, secure, and fully autonomous compute footprint tailored for the constraints of the space industry.

## Why It Exists
Standard Wnode clients (Nodlr) are designed for consumer hardware and active user management, featuring robust UI dashboards, pairing codes, and affiliate tree visualizations. Aerospace partners operate in entirely different paradigms—often involving proprietary Real-Time Operating Systems (RTOS), extremely constrained bandwidth, and rigid security protocols where human interaction is impossible. Space Node exists to bridge this gap, providing a "deploy-and-forget" machine-to-machine (M2M) interface for orbital data processing and telemetry.

## High-Level Architecture
Space Node operates strictly as a background daemon or containerized service. It maintains an active heartbeat with the Wnode orchestrator (`nodld`), receiving computational routing tasks and submitting execution proofs. The backend architecture seamlessly ingests this data, handles all cryptoeconomic settlement logic (WND/credits), and isolates the node entirely from the public-facing affiliate ecosystems.

## Identity Model
To guarantee isolation and security, Space Nodes utilize a deterministic internal identity protocol:
- **WUID (Wnode Unique Identifier):** A distinct `SP-` prefixed global identifier assigned securely upon provisioning.
- **Archetype (`AA:SP`):** The Autonomous Agent: Space Provider archetype instructs the orchestrator to route high-value space-tier workloads and applying specific orbital reward multipliers.
- **Label (`Nodlr IN`):** This internal classification ensures the node remains hidden from the public affiliate tree, enforcing strict organizational isolation.

## Zero-UI, Headless Model
Space Node contains absolutely zero frontend assets. There are no dashboards to load, no login portals to navigate, and no visual feedback loops. Configuration is handled entirely via a static, pre-provisioned bundle, and execution is managed by the partner's native process manager (e.g., systemd). 

## Benefits for Aerospace Partners
- **Zero-Touch Provisioning:** Wnode generates the configured bundle; partners simply deploy the binary.
- **Absolute Privacy:** Operational metrics and organizational data are completely isolated from public Wnode nodes.
- **Minimal Overhead:** Telemetry bandwidth is reduced to the absolute minimum required for orchestrator validation.
- **Direct Monetization:** Orbital compute and routing capabilities immediately generate WND revenue, tracked automatically via the M2M heartbeat without administrative intervention.
