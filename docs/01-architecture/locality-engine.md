# Locality Engine & Latency Proofs

## 1. Geo-IP & Network Distance Resolution
The Wnode Locality Engine resolves incoming IP addresses to latitude/longitude coordinates via embedded GeoIP lookups (`GetGeoIPLookup()`).

## 2. Hardware Memory Latency Challenge Proofs ($L_{\text{mem}}$)
To prevent virtual machine emulation attacks, CMD issues high-speed RAM latency challenge queries ($L_{\text{mem}}$). Because physical RAM access times (~10ns) cannot be emulated by cloud hypervisors without measurable latency inflation (>100ns), synthetic nodes fail attestation.
