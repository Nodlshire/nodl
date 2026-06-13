# Wnode × Stripe — Payments Architecture

## Overview

Wnode features a multi-PSP (Payment Service Provider) payment reconciliation architecture. Stripe serves as the canonical fiat-to-stablecoin and card/SEPA payment provider. It implements the standard **Universal Payment Object (UPO)** model and the **AP4M Verifiable Intent** signing framework.

---

## 1. Universal Payment Object (UPO) Mapping

The UPO establishes a single schema structure across all PSP adapters.

```
                  ┌──────────────────────────────┐
                  │   Universal Payment Object   │
                  │            (UPO)             │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                     Mapped to Stripe Parameters
   ┌───────────────────────┬──────────────────────────────────────┐
   │ UPO Parameter         │ Stripe API Parameter (PaymentIntent) │
   ├───────────────────────┼──────────────────────────────────────┤
   │ amount_minor_units    │ amount                               │
   │ currency              │ currency (lowercased)                │
   │ source_rail           │ payment_method_types (card, crypto)  │
   │ idempotency_key       │ Idempotency-Key Header               │
   │ metadata.inst_id      │ metadata.compute_instance_id         │
   │ metadata.agent_urn    │ metadata.agent_urn                   │
   └───────────────────────┴──────────────────────────────────────┘
```

- **Authorization Model**: For compute workloads, payments are created with `capture_method=manual` to authorize funds prior to simulation/workload verification, capturing only upon verified computation.
- **Crypto Sub-Profile**: Stripe handles stablecoin card payments and native USD/EUR settlement.

---

## 2. Webhook & State Machine Reconciliation

The webhook engine acts as a strict state machine receiver that enforces forward-only transitions.

```
 [ PENDING ] ──► [ PROCESSING ] ──► [ CAPTURED ] ──► [ REFUNDED ]
      │                                  │
      └──────────────────────────────────┴───────────► [ FAILED ]
```

- **Reconciliation Table**: Both incoming webhooks and payments are recorded into `incoming_webhooks` and `upo_ledger` PostgreSQL tables respectively.
- **Deduplication**: Events are verified via `Stripe-Signature` (HMAC-SHA256) and deduplicated in-memory using an event ID cache with a 10-minute TTL.
- **Backward Prevention**: If a PaymentIntent is already `CAPTURED` or `FAILED`, any attempts to set it back to `PENDING` or `PROCESSING` (e.g. out-of-order webhook delivery) are blocked and raise an exception.
- **Fallback Polling**: A background worker scans for stuck transactions (no webhook resolved within 60 seconds) and queries `GET /v1/payment_intents/:id` to force status reconciliation.

---

## 3. Filecoin Audit Layer Integration

Upon successful capture (`payment_intent.succeeded` or direct capture completion), the audit pipeline is executed:

1. A `MachinePaymentReceipt` is constructed containing payment details.
2. The receipt is canonicalized (RFC 8785) and hashed using BLAKE3.
3. The hash is signed with the node's Ed25519 validator private key.
4. The receipt is packed into a CAR file using `unixfs-v1-2025` determinism.
5. The CAR is imported to the local Kubo IPFS node and pinned.
6. The receipt is uploaded via the Lighthouse SDK to achieve permanent Filecoin deal storage.
7. The resulting CID and hashes are anchored on-chain to the FEVM smart contract (`WnodeReceiptAnchor.sol`).
8. The Stripe PaymentIntent is updated with:
   - `metadata.receipt_cid`
   - `metadata.receipt_hash`
   - `metadata.receipt_signature`
   - `metadata.previous_receipt_cid`

---

## 4. AP4M Verifiable Intent Structure

For Mastercard AP4M agent pay flows, a signed authorization envelope is produced:

```json
{
  "envelope": {
    "agent_credential": "did:ap4m:agent-abc",
    "spend_limit": "50.00",
    "currency": "USD",
    "rails": "onchain_base",
    "PSP": "stripe",
    "paymentIntentId": "pi_123",
    "receipt_cid": "bafyreceipt...",
    "receipt_hash": "blake3_hash...",
    "timestamp": 1749731516
  },
  "signature": "ed25519_hex_sig...",
  "signer_did": "did:ap4m:node-xyz"
}
```

This ensures cryptographic proof of payment approval and receipt binding for agent verification.

---

## 5. Generic PSP Implementation Interface

Any future payment service providers can be added to the multi-PSP engine by implementing the `GenericPSP` interface in `payments.ts`:

```typescript
export interface GenericPSP {
  createPayment(upo: UniversalPaymentObject): Promise<{ providerReference: string }>;
  capturePayment(providerReference: string): Promise<{ receiptCid?: string; receiptHash?: string }>;
  cancelPayment(providerReference: string): Promise<void>;
  refundPayment(providerReference: string, amountMinorUnits?: number): Promise<void>;
  getPaymentStatus(providerReference: string): Promise<UPOStatus>;
}
```

### Future Integrations Roadmap:
- **Checkout.com**: Uses `PaymentRequests` mapping UPO amounts to minor units. Webhooks verify signature using HMAC-SHA256 endpoint keys.
- **Adyen**: Leverages the `/payments` API with `/captures` followups. HMAC signature verification relies on the standard Adyen payload signature key.
- **Coinbase Business**: Native cryptocurrency processor. UPO rails maps to native blockchains; statuses are updated via confirmed block heights and webhook notifications.
- **BVNK & OKX**: Stablecoin settlement networks. Utilize settlement addresses, resolving UPO transaction confirmations via instant merchant payment statuses.
