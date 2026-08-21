# Hyper-Scale Telemetry & Ingestion Architecture (30M – 200M Nodes)

This document specifies the enterprise hyper-scale telemetry ingestion, time-series sharding, and zero-crash memory architecture required to scale the Wnode Sovereign Mesh from **30 Million** up to **200 Million active nodes** without system failure, memory contention, or dashboard rendering degradation.

---

## 1. Traffic Load & Mathematical Ingest Analysis

At global scale, telemetry heartbeats present massive continuous data ingress demands. The mathematical payload envelope is defined below:

| Metric Parameter | 30 Million Nodes (Standard) | 200 Million Nodes (Global Scale) |
| :--- | :--- | :--- |
| **Heartbeat Frequency** | Every 30 seconds | Every 30 seconds |
| **Ingress Request Volume (RPS)** | **1,000,000 requests/sec** | **6,666,666 requests/sec** |
| **Payload Size (Full JSON)** | ~500 Bytes / request | ~500 Bytes / request |
| **Raw Network Ingress Bandwidth** | **500 MB/sec (4 Gbps)** | **3.33 GB/sec (26.6 Gbps)** |
| **Daily Telemetry Volume (Raw)** | **43.2 Terabytes / day** | **287.7 Terabytes / day** |

---

## 2. Ingress Reduction: Adaptive Heartbeats & Delta Compression

To prevent network link saturation and reduce raw load on backend ingestion servers by **90%**, Wnode implements two core client-side optimization layers:

![Wnode Sovereign Mesh Hyper-Scale Ingestion Pipeline Architecture](/diagrams/hyper_scale_ingestion_pipeline.png)

### A. Adaptive Heartbeat Scaling (Dynamic Backoff)
- **Active / Compute State**: Nodes running active distributed workloads or experiencing telemetry variance submit heartbeats every **30 seconds**.
- **Idle / Stable State**: Nodes with steady uptime and unchanged vitals dynamically scale back heartbeat intervals to **300 seconds (5 minutes)**.
- **Traffic Impact**: Reduces baseline request rate for 30M nodes from 1,000,000 RPS down to **100,000 RPS** (a **10x reduction**).

### B. Binary Protobuf Delta Telemetry (State Diffs)
- Rather than transmitting full JSON metadata structures (~500B) on every tick, nodes emit binary-encoded **Protobuf / CBOR State Diffs (~50B)** containing only modified parameters.
- Bandwidth footprint drops from **4 Gbps** down to **400 Mbps** at 30M scale.

---

## 3. Distributed Ingestion & Event Queue Topology

Synchronous disk persistence on HTTP ingest endpoints creates severe I/O bottlenecks. Wnode decouples ingestion via a **Stateless Edge Gateway & Distributed Log Queue**:

![Wnode Distributed Ingestion & Event Queue Topology Architecture](/diagrams/hyper_scale_ingestion_pipeline.png)

1. **Stateless Go Ingest Gateways**: Lightweight Go HTTP workers behind Cloudflare/HAProxy ingest incoming binary telemetry envelopes, validate authentication signatures, and return HTTP 200 within **< 1 millisecond**.
2. **NATS JetStream / Apache Kafka**: Ingest gateways immediately push telemetry packets into partitioned in-memory topic queues (`telemetry.heartbeats.*`).
3. **Async Batch Consumers**: Dedicated worker pools consume messages from the queue and write bulk columnar batches into the time-series storage cluster every 1,000ms.

---

## 4. Time-Series Storage & Spatial Map Aggregation

### A. ClickHouse Columnar Storage Engine
Telemetry logs are stored in a distributed **ClickHouse** cluster partitioned by `date` and primary-indexed by `(h3_index, node_id, timestamp)`:

```sql
CREATE TABLE wnode_telemetry_sharded ON CLUSTER telemetry_cluster
(
    h3_index UInt64,
    node_id String,
    timestamp DateTime64(3),
    cpu_usage Float32,
    ram_usage Float32,
    latency_ms Float32,
    dewi_packets_in UInt32,
    work_score Float32
)
ENGINE = ReplicatedMergeTree('/clickhouse/tables/{shard}/wnode_telemetry', '{replica}')
PARTITION BY toYYYYMM(timestamp)
ORDER BY (h3_index, node_id, timestamp)
TTL timestamp + INTERVAL 90 DAY;
```

### B. H3 Hexagonal Spatial Map Aggregation
To prevent browser crash when visualizing millions of nodes in Command Centre (`apps/command`) or Nodlr (`apps/nodlr`), map endpoints query server-side **Uber H3 Spatial Hexagons**:

- **Resolution 4 (Regional Hexes)**: Used for global viewports (groups ~100,000 nodes per hex).
- **Resolution 7 (City Hexes)**: Used for localized viewports (groups ~500 nodes per hex).
- **Resolution 9 (Device Hexes)**: Used for high-zoom single-node identification.

---

## 5. Zero-Crash Resilience: Lockless Ring Buffering

To ensure 100% server uptime during catastrophic network spikes (e.g. 50M nodes reconnecting simultaneously post-outage), Go ingest workers utilize **Fixed-Size Lockless Ring Buffers**:

![Wnode Zero-Crash Lockless Ring Buffer Architecture](/diagrams/ai_autonomy_engine_diagram.png)

- **Memory Caps**: Ingest workers pre-allocate fixed-size ring buffers in RAM. Memory allocation remains static (**O(1) memory footprint**), preventing Out-Of-Memory (OOM) crashes.
- **Priority Event Dropping**: If buffer utilization exceeds 90%, non-critical metrics (e.g. minor CPU fluctuations) are dropped gracefully while critical state transitions (Node Online/Offline, Proofs, Slashing) are prioritized.

- **Memory Caps**: Ingest workers pre-allocate fixed-size ring buffers in RAM. Memory allocation remains static (**O(1) memory footprint**), preventing Out-Of-Memory (OOM) crashes.
- **Priority Event Dropping**: If buffer utilization exceeds 90%, non-critical metrics (e.g. minor CPU fluctuations) are dropped gracefully while critical state transitions (Node Online/Offline, Proofs, Slashing) are prioritized.
