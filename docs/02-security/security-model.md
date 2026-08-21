# Cryptographic Security Model

1. **Ed25519 Identity Signatures**: Every telemetry heartbeat payload is signed by the node operator's private key (`ed25519.Sign(nodePrivKey, payload)`).
2. **Device Tokens**: Long-lived secure device tokens validate heartbeats (`Authorization: Bearer <deviceToken>`).
3. **Zero Storage**: No sensitive buyer payloads or execution data are written to physical storage.
