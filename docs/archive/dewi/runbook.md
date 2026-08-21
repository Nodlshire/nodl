# DeWi & Reticulum Operational Runbook


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **DeWi & Reticulum Operational Runbook** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



This runbook outlines operational procedures, smoke testing commands, staging rollout checklists, and troubleshooting steps for Wnode DeWi adapters.

---

## 1. Staging Rollout Checklist

- [ ] Verify `dewi.yaml` exists in node execution directory or set path in environment.
- [ ] Confirm RX-only default settings are active (`tx_enabled: false`).
- [ ] Check serial device node permissions (`chmod 666 /dev/ttyUSB*` or add `nodl` user to `dialout` group).
- [ ] Start `nodld` daemon and confirm initialization logs for DeWi adapters.
- [ ] Verify HTTP status endpoint: `curl http://127.0.0.1:8080/api/v1/dewi/status`.
- [ ] Verify health endpoint: `curl http://127.0.0.1:8080/api/v1/dewi/health`.

---

## 2. Smoke Tests

### Test 1: Reticulum TCP Transport
Send a test RNS frame over TCP:
```bash
python3 -c "
import socket
s = socket.socket()
s.connect(('127.0.0.1', 4001))
s.send(bytes([0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A, 0x4C, 0x01, 0x02, 0x03]))
s.close()
"
```
Verify status update:
```bash
curl -s http://127.0.0.1:8080/api/v1/dewi/status | jq .reticulum
```

### Test 2: Semtech UDP Forwarder
Send a test LoRaWAN packet to UDP port 1700:
```bash
echo -ne '\x02\x12\x34\x00\xAA\x11\x22\x33\x44\x55\x66\x77{"rxpk":[{"time":"2026-08-12T12:00:00Z","freq":915.0,"rssi":-80,"lsnr":10.0,"data":"SGVsbG8=","size":5}]}' | nc -u -w1 127.0.0.1 1700
```
Verify revenue settlement record:
```bash
curl -s http://127.0.0.1:8080/api/v1/dewi/settlements | jq .
```

### Test 3: Serial Disconnect Resilience
Unplug USB transceiver while `nodld` is running.
Expected log output: `Meshtastic serial disconnected, retrying...`
Re-plug USB transceiver.
Expected log output: `Meshtastic serial port connected`.
Daemon MUST NOT crash.

---

## 3. Troubleshooting & Failure Recovery

| Issue | Root Cause | Solution |
|-------|------------|----------|
| `SERIAL_OPEN_FAILED` | Insufficient permissions or incorrect device path | Verify path in `dewi.yaml` and run `sudo usermod -a -G dialout $USER`. |
| `BIND_FAILED` | Port collision on 4001, 4002, or 1700 | Change ports in `dewi.yaml` or kill process holding port (`lsof -i :1700`). |
| `SIGNATURE_INVALID` | Mismatched operator key or corrupted proof | Ensure `operator.ed25519` key file has `0600` permissions. |
