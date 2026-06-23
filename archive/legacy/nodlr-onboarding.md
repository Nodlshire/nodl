# Nodlr Onboarding

## Overview
Nodlrs are the operators of nodes and the economic participants who earn from compute.  
This document defines the **onboarding process** for new nodlrs — from first entry to full operational readiness — without repeating identity, attribution, pricing, or governance details covered elsewhere.

The onboarding flow is designed to be:

- Simple,
- Transparent,
- Conversion‑friendly,
- Fully compliant,
- Suitable for solopreneurs and enterprises.

---

# Onboarding Stages

A nodlr progresses through six onboarding stages:

1. **Entry**
2. **Account Creation**
3. **Stripe Activation**
4. **Dashboard Initialization**
5. **Node Setup**
6. **Operational Readiness**

Each stage is deterministic and enforced by the steward.

---

# 1. Entry

A nodlr enters the system through one of two paths:

### **A. Organic Entry (No Invite Code)**
- The nodlr signs up directly.
- They are placed sequentially under one of the 5 active founders.
- The onboarding flow is neutral and frictionless.

### **B. Invite‑Based Entry**
- The nodlr enters using an invite code.
- They join under the inviter.
- They inherit the inviter’s founder tree.

No other differences exist between the two paths.

---

# 2. Account Creation

During account creation, the nodlr provides:

- Basic profile information,
- Authentication credentials,
- Optional organization details (for enterprise nodlrs).

The steward:

- Creates a permanent nodlr identity,
- Assigns the nodlr to a founder tree (based on entry path),
- Initializes compliance metadata.

Identity immutability and lineage rules are defined elsewhere and not repeated here.

---

# 3. Stripe Activation

To receive earnings, the nodlr must activate a **Stripe Connect account**.

Stripe handles:

- KYC/KYB verification,
- Bank account linking,
- Fraud checks,
- Regulatory compliance.

### Correct Data Flow
- **Stripe performs onboarding.**
- **Stripe returns verified account data to the steward.**
- **The steward uses this data to populate the CRM and activate the nodlr financially.**

Stripe does **not** write to the CRM directly.

A nodlr cannot operate nodes or earn until Stripe activation is complete.

---

# 4. Dashboard Initialization

Once Stripe is active, the steward:

- Hydrates the CRM record,
- Generates the nodlr’s dashboard profile,
- Unlocks operational features.

The Nodlr Dashboard provides:

- Node management tools,
- Performance metrics,
- Compliance status,
- Update requirements,
- Earnings metadata,
- Invite tools,
- Support links.

The dashboard does **not** expose:

- Founder economics,
- Other nodlrs’ data,
- Payloads or results.

It is a clean, conversion‑optimized operational interface.

---

# 5. Node Setup

Nodlrs may operate one or many nodes.

Node setup includes:

- Installing the node software,
- Generating a hardware fingerprint,
- Registering the node,
- Passing initial compliance checks,
- Receiving a compute class,
- Activating the node.

Node identity, lifecycle, and compliance rules are defined in `node-lifecycle.md`.

---

# 6. Operational Readiness

A nodlr becomes fully operational when:

- Stripe is active,
- At least one node is active,
- Compliance checks pass,
- Dashboard initialization is complete.

At this point, the nodlr:

- Begins receiving jobs (via their nodes),
- Begins earning automatically,
- Can invite others,
- Can scale horizontally by adding more nodes.

No manual approvals are required.

---

# Nodlr Responsibilities

Nodlrs are responsible for:

- Maintaining their nodes,
- Keeping software updated,
- Ensuring compliance,
- Responding to suspension notices,
- Managing their Stripe account,
- Protecting their credentials.

Nodlrs are **not** responsible for:

- Routing,
- Pricing,
- Governance,
- Identity management,
- Confidentiality enforcement.

These are handled by the steward and the architecture.

---

# Invite System

Nodlrs may invite others using:

- Invite codes,
- Dashboard‑generated links.

Invited nodlrs:

- Join under the inviter,
- Inherit the inviter’s founder tree,
- Follow the same onboarding flow.

Invites do **not**:

- Change economics,
- Change override percentages,
- Create new founder accounts,
- Modify lineage rules.

The invite system is a **growth mechanism**, not an economic modifier.

---

# Enterprise Onboarding

Enterprises may:

- Onboard multiple operators,
- Register large node fleets,
- Use organizational Stripe accounts,
- Integrate internal monitoring tools.

The onboarding flow remains identical, but enterprises may receive:

- Additional compliance guidance,
- Bulk node registration tools,
- Optional support channels.

---

# Transparency and User Experience

The onboarding flow is designed to be:

- Non‑technical,
- Fast,
- Clear,
- Non‑intimidating,
- Fully transparent.

Nodlrs always know:

- What is happening,
- Why it is happening,
- What comes next.

No hidden steps exist.

---

# Summary

Nodlr onboarding ensures:

- Simple entry,
- Deterministic founder assignment,
- Correct Stripe → steward → CRM flow,
- Clean dashboard initialization,
- Safe node setup,
- Immediate operational readiness,
- Clear responsibilities,
- Transparent invite mechanics.

Nodlrs operate nodes.  
The steward handles everything else.
