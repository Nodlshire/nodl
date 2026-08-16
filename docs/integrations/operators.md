# Node Operator Integration & Archetypes


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Node Operator Integration & Archetypes** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



Operational Specifications for Earth Mesh, Space Mesh, and Headless Validator Nodes

Wnode operators maintain mesh stability, route compute workloads, and execute state transitions across Earth and Space Mesh networks.

---

## Operator Archetypes

![Architecture](/diagrams/node-operator-headless-architecture.png)

---

## Hardware & Environment Requirements

| Node Type | Minimum Memory | CPU Architecture | Recommended OS |
| :--- | :--- | :--- | :--- |
| **Earth Mesh Node** | 16 GB RAM | x86_64 / amd64 | Linux (Ubuntu 22.04 LTS) |
| **Space Mesh Node** | 4 GB RAM | ARM64 | Android 12+ / Linux ARM |
| **Headless Validator**| 32 GB RAM | x86_64 (AVX2 support)| Dedicated Bare-Metal |