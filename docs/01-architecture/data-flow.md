# Telemetry Data Flow & Ingestion Engine

```
Node Operator Client ────(Heartbeat Pulse)────► CMD Telemetry Ingestion API
                                                      │
                                                      ▼
                                            Rate Limiter Check (10s)
                                                      │
                                                      ▼
                                         Hardware Challenge Proof (L_mem)
                                                      │
                                                      ▼
                                         Update In-Memory & BBolt SOT
```

1. **Pulse Transmission**: Node operator client sends signed heartbeat to `https://api.wnode.one/api/v1/nodes/heartbeat`.
2. **Backlog Batch Ingestion**: Reconnecting nodes flush queued heartbeats in batch mode via `/api/v1/nodes/heartbeat/batch` (max 50 payloads per batch).
3. **Adaptive Backpressure**: If rate limited (HTTP 429), server responds with `Retry-After` headers and client backs off immediately without retry storms.
