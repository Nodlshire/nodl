# Developer Quickstart Guide

Submit workloads to Wnode Sovereign Mesh in sub-50ms using the unified REST API:

```bash
curl -X POST https://api.wnode.one/api/v1/jobs/submit \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "job_type": "ram_microtask",
    "payload": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tier_requirement": "standard",
    "max_latency_ms": 50
  }'
```
