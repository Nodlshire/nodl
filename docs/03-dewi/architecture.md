# DeWi Subsystem Architecture

## 1. Frequency Tiers & Spectrum
* **US915 / EU868 ISM Bands**: License-free LoRaWAN transceivers for long-range sensor telemetry.
* **CBRS Band (3.5 GHz)**: Citizens Broadband Radio Service for private LTE / 5G small cells.
* **Sub-6 GHz 5G Micro-Cells**: Ultra-dense urban wireless coverage.

## 2. Telemetry Verification
DeWi gateways issue periodic RF spectrum proof-of-coverage (PoC) challenges verified by neighboring nodes.
