# Market Monitoring

## Overview
Market Monitoring is the steward’s system for tracking global compute prices, regional demand, node density, and energy‑adjusted costs.  
Its purpose is to ensure that wnode compute remains:

- Below market norms,
- Fairly priced across regions,
- Resistant to manipulation,
- Responsive to supply and demand,
- Transparent and auditable.

This document defines the Market Monitoring subsystem without repeating pricing formulas, governance rules, or scheduling logic covered elsewhere.

---

# Market Monitoring Principles

The steward follows six principles:

1. **Stay below cloud market rates.**
2. **Avoid regional economic distortion.**
3. **Respond to real‑world supply and demand.**
4. **Prevent manipulation by large operators.**
5. **Maintain transparency and auditability.**
6. **Never expose plaintext or user identity.**

Market monitoring is metadata‑only and confidentiality‑preserving.

---

# Market Inputs

The steward tracks five categories of market signals:

1. **Cloud Compute Pricing**
2. **Spot Instance Volatility**
3. **Regional Node Density**
4. **Regional Job Demand**
5. **Energy‑Adjusted Compute Costs**

These signals inform pricing tiers and routing incentives.

---

# 1. Cloud Compute Pricing

The steward monitors:

- CPU‑hour pricing,
- RAM‑hour pricing,
- GPU pricing (if applicable),
- Regional cloud price differences,
- Long‑term price trends.

Sources include:

- Public cloud provider pricing pages,
- Regional cost indices,
- Historical pricing archives.

Purpose:

- Keep wnode compute below market norms,
- Detect price spikes,
- Adjust incentives accordingly.

---

# 2. Spot Instance Volatility

Spot markets reveal:

- Real‑time supply/demand tension,
- Regional scarcity,
- Volatility patterns.

The steward tracks:

- Spot price fluctuations,
- Interrupt rates,
- Regional volatility curves.

Purpose:

- Identify regions where compute is scarce,
- Adjust routing incentives,
- Avoid overloading unstable regions.

---

# 3. Regional Node Density

Node density affects:

- Routing availability,
- Locality performance,
- Market balance.

The steward tracks:

- Active nodes per region,
- Class distribution,
- Resource availability,
- Node churn.

Purpose:

- Prevent regional monopolies,
- Encourage balanced growth,
- Avoid over‑concentration.

---

# 4. Regional Job Demand

Demand varies by:

- Time of day,
- Region,
- Workload type,
- Enterprise usage patterns.

The steward tracks:

- Job volume per region,
- Job type distribution,
- Peak vs. off‑peak load,
- Retry frequency.

Purpose:

- Adjust incentives,
- Balance load,
- Maintain fairness.

---

# 5. Energy‑Adjusted Compute Costs

Energy cost influences:

- Node availability,
- Regional pricing pressure,
- Operator incentives.

The steward tracks:

- Regional electricity prices,
- Energy volatility,
- Seasonal cost patterns.

Purpose:

- Prevent economic distortion,
- Encourage sustainable distribution,
- Maintain global fairness.

---

# Market Health Score

The steward computes a **Market Health Score** per region.

Inputs:

- Cloud pricing,
- Spot volatility,
- Node density,
- Job demand,
- Energy cost.

The score influences:

- Incentive tiers,
- Regional routing adjustments,
- Temporary pricing overrides.

Market Health Score never overrides:

- Compliance,
- Identity,
- Founder economics.

---

# Anti‑Manipulation Safeguards

Market monitoring prevents manipulation by:

- Large operators,
- Regional cartels,
- Coordinated node behavior.

Safeguards include:

- Density balancing,
- Performance scoring,
- Compliance enforcement,
- Identity immutability,
- Hardware fingerprinting,
- Regional normalization.

No operator can artificially inflate demand or suppress supply.

---

# Market‑Driven Incentives

The steward may apply:

- Temporary regional boosts,
- Class‑specific incentives,
- Density‑balancing incentives,
- Off‑peak bonuses.

Incentives are:

- Transparent,
- Time‑bound,
- Publicly logged,
- Non‑discretionary.

Incentives never modify:

- Founder override,
- Nodlr earnings formulas,
- Identity or lineage.

---

# Market Monitoring and Transparency

The steward publishes:

- Market summaries,
- Regional density reports,
- Demand heatmaps,
- Incentive changes,
- Pricing tier adjustments,
- Market Health Score updates.

Transparency ensures:

- Predictability,
- Trust,
- Auditability,
- Fairness.

---

# Market Monitoring and Confidentiality

Market monitoring never:

- Uses plaintext,
- Tracks user identity,
- Stores job content,
- Exposes client metadata.

All signals are derived from:

- Aggregated metadata,
- Public market data,
- Steward‑verified metrics.

Confidentiality is preserved by architecture.

---

# Summary

Market Monitoring ensures:

- Market‑aligned pricing,
- Regional fairness,
- Anti‑manipulation safeguards,
- Transparent incentives,
- Sustainable growth,
- Global economic stability,
- Confidentiality preservation.

The steward observes the market  
but never controls it.
