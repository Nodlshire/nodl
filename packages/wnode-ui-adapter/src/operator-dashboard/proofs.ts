import { UIResponse } from '../types';
import { DashboardLogsSurface } from './logs';

export class DashboardProofsSurface {
  private logsSurface: DashboardLogsSurface;

  constructor(logsSurface: DashboardLogsSurface) {
    this.logsSurface = logsSurface;
  }

  /**
   * Fetches the Proof of Compute history from the logs.
   */
  public getProofHistory(): UIResponse<any[]> {
    const logsRes = this.logsSurface.getLogs(100);
    if (!logsRes.ok || !logsRes.data) {
      return logsRes;
    }

    const proofs = logsRes.data
      .filter(log => log.proof && log.proof.merkleRoot)
      .map(log => log.proof);

    return { ok: true, data: proofs };
  }
}
