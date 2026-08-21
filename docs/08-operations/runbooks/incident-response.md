# Incident Response Runbook

## 1. High API Latency / Rate Limiting (429)
* **Check PM2 logs**: `pm2 logs backend`
* **Verify Batch Heartbeat Processing**: Check `/api/v1/nodes/heartbeat/batch` metrics.

## 2. Emergency Node Network Pause
* Execute Steward emergency circuit breaker via Soul-DAO governance portal.
