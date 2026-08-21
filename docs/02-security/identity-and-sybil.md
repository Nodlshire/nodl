# Identity Fingerprinting & Sybil Defense

## Sybil Attack Prevention
1. **Hardware Serial & CPU ID Hashing**: Unique UPID derived from `/etc/machine-id` or system UUID.
2. **RAM Latency Challenges ($L_{\text{mem}}$)**: Rejects cloud VM farms spoofing thousands of virtual node instances from a single host.
3. **Zero Synthetic Retention**: Automated detection and hard deletion of simulated nodes.
