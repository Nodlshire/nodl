# Gossip Telemetry Observability

## Overview
The Wnode telemetry plane is built over a `libp2p` GossipSub mesh. By design, the mesh utilizes eventual-consistency streams and prioritizes system resilience by explicitly dropping packets if network buffers saturate, rather than deadlocking processing loops.

## Topic Multiplexing
To scale effectively across global topologies, the telemetry engine isolates logical shards into domain-specific streams (e.g., `wnode/telemetry/<region>`) rather than distinct per-shard topics.
- **Impact:** Decreases network complexity bounds from `O(Regions * Shards)` to `O(Regions)`.
- **Validation:** Tested via `TestGossipTorture_FloodAndCollapse` generating 10,000 asynchronous multiplexed streams.

## Observability Metrics
To provide continuous oversight into mesh health, explicit Prometheus instrumentation tracks dropped packets and saturation load:
- `wnode_gossip_dropped_packets_total`: Increments natively when underlying buffers fail to distribute payload.
- `wnode_gossip_publish_failures_total`: Aggregates structural topic connection failures.
- `wnode_gossip_active_topics`: Gauges scale volume.
- `wnode_gossip_messages_published_total`: Exposes relative throughput capacity per multiplexed topic stream.
