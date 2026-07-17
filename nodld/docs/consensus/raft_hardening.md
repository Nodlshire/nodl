# Raft Transport Hardening

## Overview
Hashicorp Raft maintains the mission-critical deterministic state for the Sovereign Mesh. To protect global quorum from extreme regional partitioning events, core transport routines have been hardened for immediate socket reclamation.

## SO_REUSEADDR Socket Initialization
Under massive testing loads (leader churns every 300ms), standard TCP sockets fell into OS-level `TIME_WAIT` lockouts upon node execution restarts.

### Resolution
- Transport listeners in `internal/consensus/raft/raft_client.go` utilize a custom `net.ListenConfig`.
- Raw socket syscalls explicitly bind `SO_REUSEADDR`, guaranteeing port availability the millisecond a degraded node attempts to reboot and rejoin the cluster.
- Verified via `TestChaos_RegionPartitionAndHeal` zero-downtime recovery cycles.
