# Space Node FAQ & Operational Guidelines

## Operational Expectations

### Q: Does Space Node require a graphical interface or dashboard?
**A:** No. Space Node is entirely headless and operates strictly as a background daemon. There are no UI dependencies.

### Q: How do we view our earnings and node performance?
**A:** The node receives real-time earnings summaries in its telemetry responses, which you can log locally. For comprehensive analytics, historical ledgers, and financial settlements, Wnode administrators will provide dedicated reports or a secure portal view upon request.

### Q: Can a Space Node participate in the public affiliate program?
**A:** No. By design, Space Nodes are explicitly isolated using the `Nodlr IN` internal label. This ensures your institutional infrastructure is never exposed to the public affiliate tree, guaranteeing organizational privacy.

## Support Boundaries

### Q: How is the node software updated?
**A:** Wnode will provide updated binary payloads to partners as required. The deployment and orchestration of these updates (e.g., via OTA) remain entirely under the partner's jurisdiction to ensure compliance with aerospace safety protocols.

### Q: What happens if the network connection drops?
**A:** The node will cache completed tasks and utilize an exponential backoff strategy for telemetry transmission. Once the uplink is restored, it will flush the buffer. Note that prolonged downtime may result in standard orchestrator penalties.

### Q: Who manages the `auth_token` security?
**A:** The Wnode Command center manages token issuance and revocation. If you suspect your payload config has been compromised, Wnode can instantly rotate the token server-side without requiring immediate hardware access.

## Command Visibility

### Q: How does Wnode monitor our nodes?
**A:** Your nodes are fully visible to Wnode administrators via the internal Command dashboard. We can monitor live telemetry, track task execution, and visualize uptime in real-time, allowing us to proactively alert you to hardware or connectivity anomalies.
