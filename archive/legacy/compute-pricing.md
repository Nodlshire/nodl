# Compute Pricing

## Overview
Compute pricing in the wnode network is designed to be:

- Transparent,
- Predictable,
- Fair,
- Class‑based,
- Locality‑aware,
- Confidentiality‑preserving,
- Anti‑centralization,
- Competitive with global market rates.

Pricing is determined by **real performance**, **resource usage**, and **execution characteristics**, not by founder economics or attribution.  
This document defines how compute is priced, how market rates influence pricing, and how the steward can adjust tiers responsibly to stimulate growth.

---

# Pricing Principles

Compute pricing is built on six principles:

1. **Performance‑based pricing**  
2. **Class‑based pricing**  
3. **Locality‑aware pricing**  
4. **Confidentiality‑aligned pricing**  
5. **Market‑competitive pricing**  
6. **Full transparency**

These principles ensure that pricing remains fair, predictable, and aligned with the network’s architecture.

---

# Components of Compute Pricing

Compute pricing is based on four measurable components:

1. **CPU time**  
2. **RAM allocation**  
3. **Execution duration**  
4. **Network load**

These components are measured per job and billed proportionally.

### CPU Time
Higher‑performance CPUs complete jobs faster and therefore earn more per hour of uptime.

### RAM Allocation
RAM is a scarce resource, especially under RAM‑only execution.  
Jobs requiring more RAM cost more.

### Execution Duration
Longer jobs cost more, but pricing remains predictable because billing is proportional.

### Network Load
Network usage is priced based on:

- Chunk ingress,
- Result egress,
- Locality (lower cost when local).

---

# Compute Classes and Pricing

Compute Classes (A+, A, B, C, D, E) determine **baseline pricing**.

Higher classes:

- Execute faster,
- Support larger jobs,
- Provide higher confidentiality (A+),
- Earn more per job.

Lower classes:

- Handle lightweight workloads,
- Provide cost‑efficient compute,
- Improve locality coverage.

Pricing scales **linearly** with class capability.

---

# Locality‑Aware Pricing

Locality reduces:

- Latency,
- Backbone load,
- Transmission energy.

Local execution is rewarded with:

- **Lower client cost**,  
- **Higher routing frequency** for local nodes.

Locality never increases cost.

---

# Confidentiality and Pricing

### Software‑Level Confidentiality (All Nodes)
RAM‑only execution, zero‑storage, and encrypted streaming are included at **no extra cost**.

### Hardware‑Level Confidentiality (Class A+)
Nodes with DECC/TEE provide:

- Hardware‑isolated execution,
- Attestation,
- Enhanced confidentiality.

These nodes receive:

- Higher‑value workloads,
- Slightly higher pricing tiers.

This reflects capability, not exclusivity.

---

# Market Rate Monitoring

The steward continuously monitors global compute markets, including:

- Cloud CPU pricing,
- Cloud RAM pricing,
- Spot instance markets,
- GPU inference markets (for future GPU classes),
- Regional compute costs,
- Energy‑adjusted compute pricing.

This monitoring is:

- Automated,
- Continuous,
- Transparent,
- Logged for auditability.

Market data is used to ensure the network remains competitive without underpaying nodlrs.

---

# Automatic Below‑Market Pricing

The network is designed to be **automatically priced below market norms**.

The steward ensures:

- Baseline pricing stays below major cloud providers,
- Locality reduces cost further,
- Class‑based pricing remains competitive,
- Confidentiality does not add premium charges.

This creates a **structural advantage**:

- Lower cost for clients,
- Higher earnings for nodlrs (due to efficiency),
- Better ecological footprint,
- Stronger adoption incentives.

Below‑market pricing is not promotional — it is architectural.

---

# Manual Tier Overrides (Growth Controls)

Although pricing is primarily automatic and market‑aligned, the steward may **manually override** pricing tiers to:

- Stimulate growth in specific sectors,
- Launch special offers,
- Incentivize early adoption,
- Support developer ecosystems,
- Encourage enterprise onboarding,
- Boost usage in under‑served regions,
- Respond to market shocks.

Manual overrides are:

- Temporary,
- Logged,
- Transparent,
- Applied per class or per region,
- Never hidden from clients or nodlrs.

Overrides **cannot**:

- Change founder economics,
- Change attribution,
- Change identity,
- Create preferential treatment for specific nodlrs.

They are purely economic levers for network‑wide growth.

---

# Stripe Billing Model

Stripe handles:

- Payment method storage,
- Fraud checks,
- Charge authorization,
- Billing execution,
- Receipts.

The steward:

- Calculates job cost,
- Sends billing instructions to Stripe,
- Logs billing metadata.

The steward never stores payment data.

---

# Transparency and Predictability

The network guarantees:

- No hidden fees,
- No surge pricing,
- No nodlr‑based pricing,
- No founder‑based pricing,
- No preferential pricing.

Pricing is:

- Deterministic,
- Documented,
- Auditable,
- Stable.

Clients can predict cost before submitting a job.  
Nodlrs can predict earnings based on class and performance.

---

# Anti‑Centralization Pricing Design

Pricing is intentionally structured to prevent:

- Hyperscale dominance,
- Routing monopolies,
- Artificial price suppression,
- Artificial price inflation.

The network remains competitive because:

- Solopreneurs can operate high‑performance nodes,
- Enterprises can contribute redundant compute,
- Locality reduces cost,
- Class‑based pricing rewards capability, not scale.

No entity can distort pricing.

---

# Summary

Compute pricing ensures:

- Transparent cost calculation,
- Class‑based fairness,
- Locality‑based efficiency,
- Confidentiality without premium charges,
- Hardware‑confidentiality incentives (A+),
- Market‑aligned and below‑market pricing,
- Steward‑controlled tier overrides for growth,
- Stripe‑verified billing,
- Anti‑centralization safeguards,
- Predictable earnings for nodlrs,
- Predictable costs for clients.

Pricing is not a lever of control.  
It is a reflection of real performance, real resources, and real market conditions.
