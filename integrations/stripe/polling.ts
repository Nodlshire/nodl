/**
 * Wnode × Stripe — Fallback Polling Worker (Refactored)
 *
 * Delegates authorative fallback status resolution to the centralized multi-PSP polling core.
 */

import { CentralPollingWorker } from '../payments/reconciliation';

export class StripePollingWorker extends CentralPollingWorker {
  // Backwards-compatible bridge method
  async runCycle(): Promise<void> {
    await this.pollPendingTransactions();
  }
}
