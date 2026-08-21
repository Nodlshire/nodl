# Node Operator Lifecycle

This document defines the complete lifecycle of a network operator, tracing the path from initial sign-up to continuous revenue generation.

## 1. Operator Onboarding & Authentication

Operators begin their journey within the central Command Center (CMD) portal.
- Authentication utilizes the `papermark_auth.ts` middleware or native email/wallet logic to establish an `operator_id`.
- Operators navigate to their dashboard, where they are prompted to establish their payment gateway before nodes can successfully yield USD.

## 2. Stripe KYC Flow

To comply with international regulatory standards, all payouts are gated behind Stripe Connect.
1. The operator triggers the onboarding API (`POST /api/payouts/onboard`).
2. The Mesh generates a localized Stripe `AccountID` and a unique `OnboardURL`.
3. The operator is redirected to the secure Stripe environment to provide Know Your Customer (KYC) documentation, bank details, and tax records.
4. Until `PayoutsEnabled` registers as `true` inside the `PayoutEngine`, their earned funds will sit securely within the `Pending` ledger.

## 3. Node Linking & Initialization

Once an operator establishes their account, they download and configure the `node-operator` binary (or simply `nodlr`).
- The operator injects their unique `operator_id` as an environment variable or flag.
- When the node boots, it issues a WebSocket `announce` payload to the Mesh.
- The `Server` automatically maps the specific `NodeID` (generated natively by the hardware) to the parent `operator_id` within the `nodeOperators` ledger. An operator can link an infinite number of distinct nodes under a single parent ID.

## 4. Operator Account States

An operator transitions through several states natively within the Mesh logic:
- **Unverified**: Node is running, generating `WorkUnits` (WU), but Stripe is unlinked. Earnings accumulate in `Pending`.
- **Verified / Active**: Node is running, generating WU, Stripe is fully linked. `Pending` balances are automatically swept to the connected bank account on the daily interval.
- **Degraded**: If the operator's nodes consistently fail tasks or manipulate hardware reports, the node's reputation drops. While the operator is technically "active," they are blacklisted from scheduling, freezing their earnings potential until the node repairs its reputation score.

## 5. Earnings Lifecycle

The lifecycle of operator earnings mirrors a strict accounting sequence:
1. **Work Unit Generation**: Nodes execute tasks and return `TaskResultPayloads`.
2. **Pricing Matrix Application**: WU is translated instantly to `AmountUSD`.
3. **RewardLedger Crediting**: `TotalEarned` rises.
4. **PayoutEngine Synchronization**: The engine snapshots `TotalEarned`, subtracting historical `PaidOut` to isolate current `Pending`.
5. **Stripe Transfer**: Funds move from the central Wnode platform bank to the operator's connected Express account.
6. **PaidOut Reconciliation**: The transfer successfully completes, raising `PaidOut` to equal `TotalEarned`, zeroing the `Pending` balance for the day.

## 6. CRM Slide-Out Data Model

The CMD portal visualizes this lifecycle using aggregated data provided by the CRM Sync Engine.
- `TotalNodes`: Distinct count of active WebSocket connections tied to the operator.
- `TotalWU`: Aggregate computation volume successfully validated.
- `TotalReward`: Lifetime USD value generated.
- `AverageReputation`: A weighted network trust metric out of 100, representing the combined health of all nodes owned by the operator.
