# Troubleshooting & Diagnostic Recovery

### Common Errors

#### 1. HTTP 429 Too Many Requests
* **Cause**: Backlog heartbeat queue flushing sequentially.
* **Resolution**: The `nodl-core` daemon handles backpressure via batch heartbeats (`/api/v1/nodes/heartbeat/batch`) and exponential backoff.

#### 2. Reboot Status Persistence
* **Cause**: Node dropped offline post-reboot.
* **Resolution**: `nodld` server employs self-healing token reconstruction to reactivate verified nodes immediately on heartbeat.
