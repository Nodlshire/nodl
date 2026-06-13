# Developer Onboarding & Local Testing

This guide walks new developers through booting the entire Wnode stack locally, simulating node workloads, and successfully testing the payout infrastructure.

## 1. Prerequisites

Ensure you have the following installed locally:
- Go `v1.25+`
- Node.js `v20+` and `pnpm`
- A Stripe Developer Account (to obtain test keys)

## 2. Booting the Stack

You must run both the Mesh Backend and the CMD Frontend simultaneously.

### Local CRM / CMD Setup
1. Navigate to the frontend directory (e.g., `apps/command` or `papermark` core).
2. Install dependencies: `pnpm install`
3. Start the dev server: `pnpm run dev`
4. The CMD dashboard will be available at `http://localhost:3000` (or `4000` depending on your `.env` configuration).

### Local Mesh Setup
1. Navigate to the Go backend `node-operator` directory.
2. Initialize environment variables. At minimum, export a Stripe test key:
   `export STRIPE_SECRET_KEY="sk_test_..."`
3. Build and run the server:
   `go run cmd/server/main.go`
4. The Mesh WebSocket will mount at `ws://localhost:8080/ws` and debug routes will mount on `http://127.0.0.1:3037`.

## 3. Simulating Node Operators

To test task routing, you must spin up a localized operator binary.
1. Run the `nodlr` binary or the `node-operator` client logic in a separate terminal.
2. Provide a mock `OPERATOR_ID="test_user_123"`.
3. The node will issue an `announce` payload to the Mesh. 
4. Check the central registry state via `curl http://127.0.0.1:3037/debug/nodes` to confirm your local node is successfully classified.

## 4. Testing Stripe Payouts Safely

The `PayoutEngine` is designed for secure, rapid testing without moving real money.

1. **Trigger Onboarding**:
   Simulate a user clicking "Connect Bank" by executing:
   `curl -X POST http://127.0.0.1:8080/api/payouts/onboard?operator_id=test_user_123`
   Copy the `onboard_url` and complete the Stripe sandbox flow in your browser.

2. **Generate Earnings**:
   Submit tasks targeting your connected node. Allow the tasks to complete successfully to build `TotalEarned` in the ledger.

3. **Force a Payout Cycle**:
   Instead of waiting 24 hours for the scheduler to tick, manually override the cycle:
   `curl -X POST http://127.0.0.1:8080/api/payouts/execute`

4. **Verify Ledger Adjustment**:
   Query the debug endpoint:
   `curl http://127.0.0.1:3037/debug/payouts/earnings`
   You should see `Pending` drop to `0.00` and `PaidOut` match `TotalEarned`.

5. **Verify Stripe**:
   Log in to your Stripe Test Dashboard. Under the "Connect" tab, you should see the newly provisioned Express account and a logged USD Transfer.

## 5. Testing the CRM Sync Engine

The `SyncEngine` defaults to a 10-minute cadence. To test the pipeline rapidly:
1. Temporarily modify `CRM_SYNC_INTERVAL_MINS=1` in your environment.
2. Reboot the Mesh server.
3. Query `curl http://127.0.0.1:3037/debug/crm-sync`.
4. Observe the console logs ensuring that `POST` requests are safely making it to the frontend's API routes (`/api/operators/economics`) and returning a `200 OK` status.
