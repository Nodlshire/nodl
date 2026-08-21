# Security Policy & Responsible Vulnerability Disclosure

Wnode considers security a foundational protocol pillar. We appreciate security researchers and engineers who audit our codebase and disclose vulnerabilities responsibly.

---

## 1. Reporting a Vulnerability

If you discover a security vulnerability, threat vector, or cryptographic weakness within Wnode core daemons (`nodld`), node operator applications (`node-operator`), smart contracts, or web infrastructure, **do NOT create a public issue**.

Please submit confidential reports to:
* **Security Email**: `security@wnode.one`
* **PGP Key Fingerprint**: `9F81 4E2A 318B 6712 C90B 1234 A567 8901 BC23 DE45`

Please include:
1. Detailed description of the vulnerability.
2. Step-by-step proof-of-concept (PoC) or reproduction steps.
3. Potential impact assessment (e.g., unauthorized compute execution, memory inspection, denial of service).
4. Suggested remediation if available.

---

## 2. Severity Classification Matrix

| Severity | Description | SLA Target |
| :--- | :--- | :--- |
| **Critical** | Remote code execution, host RAM breakout, network-wide state corruption | 24 Hours |
| **High** | Telemetry spoofing, token forging, unauthorized API access | 48 Hours |
| **Medium** | Rate limit bypass, localized memory leak, edge-case denial of service | 7 Days |
| **Low** | Minor information disclosure, non-sensitive UI/UX bug | 14 Days |

---

## 3. Responsible Disclosure Guidelines

When conducting security research on Wnode infrastructure:
* Do not perform Denial of Service (DoS) attacks against live production endpoints (`wnode.one`).
* Do not access, leak, or destroy user data or active node credentials.
* Allow the Wnode team a reasonable time window (typically 90 days) to remediate vulnerabilities prior to public disclosure.

---

## 4. Security Guarantees & Non-Scope

### In-Scope Protocols & Binaries
* Proprietary Node Operator Daemon (`nodld` / `nodl-core` / `nodl-desktop`)
* Command Telemetry Pipeline (CMD)
* Soul-DAO Governance & Staking Contracts
* DeWi Transceiver Subsystem

### Out-of-Scope
* Social engineering or phishing against node operators.
* Physical physical tamper attacks on isolated individual consumer nodes.
