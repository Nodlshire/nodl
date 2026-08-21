# Infrastructure Monitoring & Service Watchdogs

1. **PM2 Process Monitoring**: Automated watchdogs restart `nodld` and `web` on failure.
2. **Prometheus Metrics**: System health metrics exposed on `/metrics`.
3. **Zero-Synthetic Telemetry Verification**: Real-time heartbeat validation logs monitored in `backend_logs.txt`.
