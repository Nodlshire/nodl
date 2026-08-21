# Stripe Connect Architecture

## Overview
The wnode network uses Stripe Connect as the financial backbone of the entire platform.  
Stripe handles onboarding, identity verification, compliance, money movement, revenue protection, and payouts.  
The steward never touches user funds directly.

Stripe Connect ensures:

- Global compliance,
- Secure money handling,
- Verified identities,
- Protected revenue flows,
- Automated payouts,
- Fraud prevention.

This document defines how Stripe integrates with the network and why it is foundational to the platform’s economic integrity.

---

## Why Stripe Connect
Stripe Connect provides:

- KYC/KYB verification,
- Identity validation,
- Bank account verification,
- Fraud detection,
- PCI compliance,
- Secure money movement,
- Automated payouts,
- Global regulatory coverage.

This allows the steward to:

- Avoid storing financial data,
- Avoid handling sensitive documents,
- Avoid building compliance infrastructure,
- Avoid managing payout schedules,
- Avoid regulatory exposure.

Stripe handles the financial risk.  
The steward handles the compute network.

---

## Onboarding Flow
Every nodlr must complete Stripe onboarding before:

- Running nodes,
- Earning revenue,
- Receiving payouts.

Onboarding includes:

- Email verification,
- Legal name,
- Address,
- Date of birth,
- Government ID (if required),
- Bank account or debit destination.

Stripe determines:

- What information is required,
- What documents must be uploaded,
- Whether enhanced verification is needed.

The steward does not decide KYC requirements.  
Stripe does.

---

## Compliance and KYC/KYB
Stripe enforces:

- Know Your Customer (KYC),
- Know Your Business (KYB),
- Anti‑Money Laundering (AML),
- Counter‑Terrorist Financing (CTF),
- Sanctions screening,
- Fraud detection,
- Identity verification.

This ensures:

- Every nodlr is a verified human or business,
- Every payout is compliant,
- Every account meets regulatory standards.

The steward never stores:

- IDs,
- Bank accounts,
- Legal documents,
- Sensitive financial data.

Stripe stores and protects all of it.

---

## Revenue Protection
Stripe protects revenue by:

- Holding funds in secure, regulated accounts,
- Preventing unauthorized access,
- Ensuring payouts only go to verified recipients,
- Enforcing fraud checks on every transaction.

Funds flow:

1. Mesh Client pays for compute  
2. Stripe collects the payment  
3. Stripe allocates revenue to the steward and nodlrs  
4. Stripe schedules payouts to nodlrs  
5. Stripe distributes override to founders (via steward’s platform account)

At no point does the steward:

- Hold user funds,
- Move user funds,
- Store payment details.

Stripe handles all money movement.

---

## Daily Payouts
The network uses **daily payouts** for nodlrs.

Stripe handles:

- Payout batching,
- Bank transfers,
- Currency conversion (if needed),
- Failed payout retries,
- Payout reporting.

Nodlrs receive:

- Daily earnings,
- Direct to their bank account,
- With full Stripe reporting.

Founders receive override through the steward’s platform account, also paid out daily.

---

## Fraud Prevention
Stripe provides:

- Identity verification,
- Bank verification,
- Device fingerprinting,
- Behavioral analysis,
- Sanctions screening,
- Chargeback protection,
- Fraud scoring.

This prevents:

- Fake nodlr accounts,
- Fraudulent payouts,
- Identity laundering,
- Payment abuse.

The steward does not build fraud systems.  
Stripe provides them.

---

## Money Flow Architecture
The money flow is:

**Mesh Client → Stripe → Steward Platform Account → Nodlr Accounts → Bank Accounts**

Broken down:

1. **Mesh Client pays**  
   - Stripe processes the payment  
   - Funds enter the steward’s platform balance  

2. **Revenue split**  
   - Stripe allocates nodlr earnings  
   - Stripe allocates founder override  
   - Stripe allocates steward fees  

3. **Daily payouts**  
   - Stripe sends nodlr earnings to their bank  
   - Stripe sends founder override to their bank  
   - Stripe sends steward revenue to the steward’s bank  

The steward never touches funds manually.

---

## Security of Money Handling
Stripe provides:

- PCI compliance,
- Encrypted card handling,
- Secure bank transfers,
- Regulated custodial accounts,
- Global financial compliance.

This ensures:

- Funds cannot be intercepted,
- Funds cannot be misallocated,
- Funds cannot be lost,
- Funds cannot be stolen.

Stripe is the financial perimeter of the network.

---

## Steward Responsibilities
The steward is responsible for:

- Creating Stripe accounts for nodlrs,
- Linking nodlrs to their Stripe accounts,
- Calculating earnings,
- Sending payout instructions to Stripe.

The steward is **not** responsible for:

- KYC decisions,
- Fraud decisions,
- Payout timing,
- Bank verification,
- Regulatory compliance.

Stripe handles all of these.

---

## Summary
Stripe Connect provides:

- Verified onboarding,
- Global compliance,
- Secure money movement,
- Protected revenue flows,
- Automated daily payouts,
- Fraud prevention,
- Regulatory coverage.

The steward never touches funds.  
Stripe protects the entire economic layer of the network.
