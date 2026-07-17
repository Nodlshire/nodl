# Sovereign Mesh Architecture

## Overview
The Wnode Sovereign Mesh is a highly robust, multi-modal distributed system designed for enterprise-grade autonomous compute orchestration. It utilizes a deterministic dual-Raft architecture to strictly isolate regional performance from global governance states.

## Consensus Layer
The mesh operates on two distinct networking topologies:
1. **Hashicorp Raft (Control Plane):** Maintains strict transactional consistency for governance, quotas, operator registries, and routing topologies. Uses dedicated persistent BoltDB storage and guarantees monotonic state progression.
2. **libp2p GossipSub (Telemetry Plane):** Provides eventually consistent, high-throughput delivery of node telemetry, resource saturation metrics, and ephemeral security events.

## Dual-Raft Region Isolation
The architecture deploys parallel Raft clusters:
- **Regional Raft:** Manages state local to a specific geographical failure domain.
- **Global Raft:** Synchronizes cross-region orchestration policies and arbitration metrics.

### Isolation Guarantees
If the Global Raft quorum fails or partitions, Regional Raft clusters continue to function autonomously, servicing local operator bindings and telemetry processing without global dependency.

## Autonomy and AI Orchestration
The system runs autonomous orchestration loops that process telemetry and enact mathematical routing behaviors. The AI-Assisted Advisory layer acts as an "Observability Overwatch," proposing optimization recommendations that are strictly bound by the Human-in-the-Loop Consensus Controller.

## Operational Modes
The matrix supports 9 progressive modes, scaling from single-node `legacy` to a fully distributed, intelligent `ai-assisted` mesh. Mode toggles ensure deterministic behavior transitions.
