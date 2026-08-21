# STRIDE Threat Model & Security Matrix

| STRIDE Category | Vector | Wnode Mitigation Countermeasure |
| :--- | :--- | :--- |
| **Spoofing** | Synthetic node identity injection | Ed25519 signed heartbeats + Hardware $L_{\text{mem}}$ latency challenge |
| **Tampering** | Memory execution tampering | RAM-isolated tmpfs + k-redundant SHA-256 hash consensus |
| **Repudiation** | Denying job completion/timing | Immutable BLS12-381 aggregated multi-sig proofs |
| **Information Disclosure** | Host memory inspection | Zero disk persistence + `explicit_bzero` RAM wipe |
| **Denial of Service** | CMD Telemetry API flooding | Randomized epoch heartbeat jitter ($T_{\text{jitter}}$) + rate limiting |
| **Elevation of Privilege** | Sandbox container breakout | Unprivileged cgroups v2 + seccomp-bpf syscall filtering |
