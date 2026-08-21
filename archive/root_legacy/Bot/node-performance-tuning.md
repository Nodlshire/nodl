# Node Performance Tuning

## Overview
Node performance directly affects:

- Routing frequency,
- Job completion speed,
- Earnings,
- Compute Class placement,
- Confidentiality compliance,
- Stability,
- Update eligibility.

This document explains how nodlrs can optimize their nodes — from single‑machine setups to large mini‑datacenters — while maintaining the network’s confidentiality, zero‑storage, and anti‑centralization guarantees.

Performance tuning is optional, but highly recommended.

---

# Core Principles of Node Performance

Node performance is determined by:

- CPU capability,
- RAM availability,
- Cooling efficiency,
- Network stability,
- Update compliance,
- Confidentiality compliance,
- Hardware health,
- System load.

The steward evaluates nodes continuously and routes jobs accordingly.

---

# Confidentiality‑Safe Optimization

Performance tuning must **never** violate confidentiality.

All optimizations must preserve:

- RAM‑only execution,
- No swap usage,
- No disk writes of plaintext,
- No caching of payloads,
- No persistence of results,
- Ephemeral key handling,
- Encrypted chunk streaming.

Nodes must remain compliant with:

- Zero‑storage architecture,
- Software‑level confidentiality,
- Hardware‑level confidentiality (if available),
- TEE/DECC isolation (if supported).

Performance tuning must **never**:

- Enable swap,
- Write decrypted data to disk,
- Log plaintext,
- Cache job data.

Confidentiality is non‑negotiable.

---

# CPU Optimization

### 1. Use High‑Performance Power Profiles
Ensure the OS is set to:

- High‑performance mode,
- Maximum CPU frequency,
- No aggressive power saving.

### 2. Disable CPU Throttling
Prevent:

- Thermal throttling,
- Power‑saving throttling,
- BIOS‑level throttling.

### 3. Keep BIOS/Firmware Updated
Modern firmware improves:

- Stability,
- Performance,
- Security.

### 4. Prefer Modern Architectures
Newer CPUs:

- Execute jobs faster,
- Use less power per job,
- Improve Compute Class placement.

---

# RAM Optimization

### 1. More RAM = More Jobs
Nodes with more RAM:

- Receive larger jobs,
- Receive more jobs,
- Move into higher Compute Classes.

### 2. Avoid RAM Fragmentation
Keep the system clean:

- Close background apps,
- Avoid memory‑heavy local workloads,
- Reboot periodically.

### 3. Disable Swap
Swap is forbidden for confidentiality reasons.

Ensure:

- Swap is disabled,
- No compressed memory,
- No disk‑backed paging.

### 4. Use Fast RAM
Higher RAM frequency improves:

- Decryption speed,
- Execution speed,
- Streaming performance.

---

# Cooling Optimization

### 1. Keep Temperatures Low
Cooler CPUs:

- Maintain higher clock speeds,
- Avoid throttling,
- Improve stability.

### 2. Improve Airflow
Use:

- Clean fans,
- Open airflow paths,
- Dust‑free intakes.

### 3. Avoid Enclosed Spaces
Nodes should not be placed in:

- Cabinets,
- Drawers,
- Unventilated corners.

### 4. Mini‑Datacenter Cooling
For clusters:

- Use rack airflow patterns,
- Avoid heat stacking,
- Use quiet, efficient fans.

No industrial cooling is required.

---

# Network Optimization

### 1. Prefer Wired Ethernet
Wired connections provide:

- Lower latency,
- Higher stability,
- Higher throughput.

### 2. Use Quality Routers/Switches
Avoid:

- Low‑end consumer routers,
- Overloaded Wi‑Fi networks.

### 3. Stable Internet = More Jobs
Nodes with unstable connections:

- Lose routing priority,
- Fail jobs,
- Drop in performance score.

### 4. Locality Advantage
Nodes close to clients:

- Receive more jobs,
- Reduce transmission energy,
- Improve environmental efficiency.

---

# OS Optimization

### 1. Keep the OS Updated
Updates improve:

- Security,
- Stability,
- Performance.

### 2. Disable Background Tasks
Avoid:

- Indexing,
- Heavy local workloads,
- Scheduled scans during peak hours.

### 3. Use Lightweight Environments
On Linux:

- Prefer XFCE, LXDE, or headless modes,
- Avoid heavy desktop environments.

### 4. Avoid Virtual Machines
VMs:

- Reduce performance,
- Increase latency,
- Break hardware fingerprinting.

Bare metal is preferred.

---

# Hardware Optimization

### 1. SSD for OS
Use SSDs for:

- Fast boot,
- Fast updates,
- System responsiveness.

### 2. Reliable Power
Use:

- UPS units (optional),
- Surge protection,
- Stable circuits.

### 3. Clean Hardware
Dust reduces:

- Cooling efficiency,
- Performance,
- Stability.

### 4. Hardware Upgrades
Upgrades that improve performance:

- More RAM,
- Better cooling,
- Faster CPUs,
- Newer motherboards.

All upgrades are welcome.

---

# TEE/DECC Optimization (Class A+)

Nodes with hardware confidentiality features should:

- Enable TEE/DECC in BIOS,
- Keep firmware updated,
- Use supported OS configurations,
- Ensure attestation is functioning.

These nodes receive:

- Higher confidentiality classification,
- Access to sensitive workloads,
- Higher‑value jobs.

---

# Mini‑Datacenter Optimization

### 1. Balanced Power Distribution
Avoid overloaded circuits.

### 2. Proper Airflow
Ensure:

- Front‑to‑back airflow,
- No heat stacking,
- Adequate spacing.

### 3. Network Segmentation
Use:

- Dedicated switches,
- VLANs (optional),
- Wired connections.

### 4. Mixed Compute Classes
Clusters can include:

- High‑performance nodes,
- Standard nodes,
- Lightweight nodes.

The steward routes jobs accordingly.

---

# Performance Score

The steward maintains a **performance score** for each node based on:

- Job success rate,
- Latency,
- Stability,
- Update compliance,
- Confidentiality compliance,
- Real‑world throughput.

Higher scores → more routing → more earnings.

---

# Summary

Node performance tuning ensures:

- Higher routing frequency,
- Faster job completion,
- Higher earnings,
- Better Compute Class placement,
- Strong confidentiality compliance,
- Stability and reliability,
- Efficient mini‑datacenters,
- Support for solopreneurs and enterprises.

Performance tuning is optional — but it pays.
