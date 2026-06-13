# Payout Engine (Phase 13)

The Payout Engine automates and facilitates the financial remuneration of network operators using Stripe Connect. It calculates pending balances and schedules cross-border payout transfers.

## 1. OperatorEarnings Ledger

At the core of the engine sits the `OperatorEarnings` struct, tracking three fundamental pillars of data:
- `TotalEarned`: The absolute, all-time USD equivalent earned by an operator. This is synchronized directly from the underlying Mesh `RewardLedger`.
- `PaidOut`: The total USD successfully pushed via Stripe Transfers.
- `Pending`: The dynamic difference (`TotalEarned` - `PaidOut`), representing the exact amount owed to the operator.

## 2. PayoutRecord Model

Every transaction attempt is permanently serialized into a `PayoutRecord`.
- A UUID is generated immediately upon execution start.
- `AmountUSD` reflects the exact pending value locked for transfer.
- The `Status` moves from `pending` to either `success` or `failed`.
- If successful, the `TransferID` returned by Stripe is logged. If failed, the `ErrorMsg` is captured to aid operational debugging.

## 3. StripeClient Wrapper

The `StripeClient` acts as a localized proxy to the `stripe-go` SDK, masking complex API definitions.
- `CreateConnectedAccount`: Invokes the Stripe API to spin up a new "Express" Connect account, returning the `account_id` and the KYC `onboard_url`.
- `ProcessOperatorPayout`: Initiates a direct Stripe Transfer of USD to a specific `destinationAccountID`. Values are correctly calculated into integer cents before dispatch.
- `CheckAccountStatus`: Queries Stripe to ensure `ChargesEnabled` and `PayoutsEnabled` are true before attempting to push funds, preventing failed transfer loops.

## 4. Stripe Connect Onboarding Flow

1. An operator clicks "Connect Bank" on the CMD interface.
2. The CMD triggers `POST /api/payouts/onboard` with the operator's ID.
3. The mesh engine generates a Stripe Connect account and a unique session link.
4. The link is returned to the user, who follows Stripe's secure flow (KYC, bank routing, tax forms).
5. Stripe redirects the user back to the CMD upon completion or failure.

## 5. Daily Payout Scheduler

Payout cycles are strictly controlled internally, rather than relying on external Stripe scheduled sweeps.
- The `StartDailyJob()` runs a non-blocking goroutine ticker set to 24 hours.
- It triggers `ExecutePayoutCycle()`.
- The cycle syncs `TotalEarned` from the mesh, isolates operators with a `Pending` balance $> 0$, verifies their Stripe KYC status, and issues the Transfer sequentially.

## 6. Manual Payout Trigger

To support operational agility and localized testing, the system provides an override:
- `POST /api/payouts/execute`
- This endpoint immediately spawns a goroutine to run `ExecutePayoutCycle()` bypassing the daily ticker.

## 7. Debug Endpoints

The Payout Engine provides direct insight via two internal debug tools:
- `GET /debug/payouts/earnings`: Dumps the entire map of `OperatorEarnings`, visually detailing the exact pending liability of the network.
- `GET /debug/payouts/history`: Returns a flat JSON array of all `PayoutRecord` structs, serving as an immutable, internal transaction log.
