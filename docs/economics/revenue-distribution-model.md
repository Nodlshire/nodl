# Authoritative 6-Tier Revenue Split & Settlement Model

This specification details the mathematical architecture and settlement execution engine for revenue distribution across the Wnode Sovereign Mesh network.

---

## 1. Executive Revenue Split Allocation Matrix

All network revenue generated through compute execution, bandwidth routing, and DeWi wireless relay services is settled across a **6-Tier Authoritative Distribution Matrix** summing to **100.0%**:

```
+-----------------------------------------------------------------------+
|                 GROSS NETWORK INFLOW REVENUE (100.0%)                  |
+---+---------------+---------------+---------------+---------------+---+
    |               |               |               |               |
    | 70.0%         | 10.0%         | 3.0%          | 7.0%          | 7.0%      | 3.0%
    v               v               v               v               v           v
+-------+       +-------+       +-------+       +-------+       +-------+   +-------+
| NODLR |       | SALES |       |AFFILI-|       |AFFILI-|       |STEWARD|   |FOUNDER|
| OPERA-|       | SOURCE|       | ATE   |       | ATE   |       |  FEE  |   | LIFELONG|
|  TOR  |       | COMM. |       | LEVEL1|       | LEVEL2|       | (7.0%)|   | (3.0%)|
|(70.0%)|       |(10.0%)|       | (3.0%)|       | (7.0%)|       +-------+   +-------+
+-------+       +-------+       +-------+       +-------+
```

### Detailed Share Breakdown

| Tier Component | Percentage Share | Beneficiary Target | Settlement Trigger |
| :--- | :--- | :--- | :--- |
| **Nodlr (Node Operator)** | **70.0%** | Hardware Node Operator running binary (`nodld`) | Proof-of-Work & Proof-of-Coverage Verification |
| **Sales Source Commission** | **10.0%** | Direct deal/hardware referrer or sales channel source | Epoch settlement trigger |
| **Affiliate Level 1 (Direct)** | **3.0%** | Direct Level 1 referring account | Real-time commission ledger credit |
| **Affiliate Level 2 (Tier 2)** | **7.0%** | Parent Level 2 referring account in genealogy tree | Real-time commission ledger credit |
| **Steward Fee** | **7.0%** | Wnode Infrastructure Stewardship & Network Maintenance | Automated protocol treasury vault |
| **Founder Lifelong Affiliate** | **3.0%** | Founder sovereign key identity (`100001-0426-01-AA`) | Immutable perpetual protocol distribution |

---

## 2. Mathematical Settlement Formula

For any gross settled transaction value $V_{\text{gross}}$:

$$V_{\text{Nodlr}} = V_{\text{gross}} \times 0.700$$
$$V_{\text{SalesSource}} = V_{\text{gross}} \times 0.100$$
$$V_{\text{AffiliateL1}} = V_{\text{gross}} \times 0.030$$
$$V_{\text{AffiliateL2}} = V_{\text{gross}} \times 0.070$$
$$V_{\text{Steward}} = V_{\text{gross}} \times 0.070$$
$$V_{\text{Founder}} = V_{\text{gross}} \times 0.030$$

$$\sum V = V_{\text{gross}} \times (0.70 + 0.10 + 0.03 + 0.07 + 0.07 + 0.03) = 1.000 \times V_{\text{gross}}$$

---

## 3. Double-Entry SSOT Persistence Architecture

When a job or DeWi proof is settled, `nodld/internal/account/store.go` executes an atomic database transaction in `state/engine.db` / `state/engine.json`:

```json
{
  "settlement_id": "stl-8893a2-2026-0816",
  "gross_usd": 100.00,
  "distributions": {
    "nodlr_operator_usd": 70.00,
    "sales_source_usd": 10.00,
    "affiliate_l1_usd": 3.00,
    "affiliate_l2_usd": 7.00,
    "steward_fee_usd": 7.00,
    "founder_commission_usd": 3.00
  },
  "timestamp": "2026-08-16T04:45:00Z"
}
```

This guarantees **zero floating-point discrepancy** and complete auditability across Nodlr finances (`/dashboard/finances`) and Command Centre financials.
