# Compute Tiers

## Overview
Compute tiers define the specific hardware specifications and pricing for workloads on the wnode network. While **Compute Classes** are operational (eligibility), **Compute Tiers** are market-facing (cost and capacity).

The network provides six standardized tiers designed to cover everything from lightweight sandboxes to extreme GPU processing.

---

# Authoritative Tiers

The following specifications are hardcoded in the Steward's pricing engine:

| Tier | Name | CPU Cores | RAM | GPU | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tiny** | Tiny | 4 | 8 GB | None | Entry-level sandbox for microservices and testing. |
| **Standard** | Standard | 16 | 32 GB | T4 | Balanced general-purpose compute for web apps. |
| **High RAM** | High RAM | 16 | 256 GB | None | Memory-optimized for large datasets and caching. |
| **Boost** | Boost | 32 | 64 GB | RTX 4090 | High-performance GPU compute for AI/ML. |
| **Ultra** | Ultra | 64 | 128 GB | 2x RTX 4090 | Multi-GPU extreme performance for heavy loads. |
| **DECC/TEE** | DECC/TEE | 24 | 80 GB | H100 | Encrypted confidential compute with TEE hardware. |

---

# Pricing Model

The pricing for each tier is dynamic and managed by the **Autonomous Pricing Engine**.

- **Market-Following**: Prices automatically adjust based on global cloud market rates.
- **Auto-Tuning**: The steward applies "Undercut" or "Volatility Adaptive" rules to ensure wnode remains the most cost-effective choice.
- **Smoothing**: Price shifts are dampened by SMA (Simple Moving Average) filters to prevent extreme volatility.

### Capacity (Throughput)
Capacity is measured in **TH/s** (Task Throughput per second) and represents the total processing power available within each tier's current node cluster.

---

# Alignment with Compute Classes

While tiers define *what* is being sold, classes define *who* is allowed to provide it:

- **Class C nodes** typically fulfill **Tiny** workloads.
- **Class B/A nodes** fulfill **Standard**, **High RAM**, and **Boost** workloads.
- **Class A+ nodes** fulfill **DECC/TEE** and high-integrity **Ultra** workloads.

---

# Summary
Compute tiers ensure that users have predictable, high-performance options for their workloads, while the Pricing Engine ensures those options remain competitive and fair across all regions.
