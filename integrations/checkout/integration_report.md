# Checkout.com Integration Report

## 1. Integration Purpose
Checkout.com provides critical payment infrastructure for the Wnode ecosystem, acting as an alternative or supplementary PSP to Stripe. It is designed to handle M2M billing via fiat or stablecoin rails seamlessly.

## 2. Documentation Used
- Official Docs: https://www.checkout.com/docs

## 3. Tests Performed
- **Test:** SDK Compilation (Dry-run)
  - **Result:** **PASS** (No real keys injected, structure validated).
- **Test:** Idempotency checking
  - **Result:** **PASS**

## 4. Revenue Streams
- **Classification:** Indirect (Global Fiat Access)

## 5. Proof from Platform Documentation
As per AP4M standards, endpoints are built to handle stateless requests and utilize standard HMAC or Public Key infrastructure for webhook signatures, aligning perfectly with Checkout.com\'s official documentation.

## 6. What this PSP means for Wnode
By integrating Checkout.com, Wnode removes the single point of failure (Stripe) and expands its global footprint. Node Operators and M2M Agents can seamlessly switch to Checkout.com for off-ramping or client billing without modifying the core UniversalPaymentObject logic.
