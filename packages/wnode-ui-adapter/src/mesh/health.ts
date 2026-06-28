import { MeshHealthMonitor, MeshHealthReport } from '@wnode/sdk';
import { UIResponse } from '../types';
import { normalizeUIError } from '../errors/normalize';

export class UIMeshHealthAdapter {
  private monitor: MeshHealthMonitor;

  constructor(monitor: MeshHealthMonitor) {
    this.monitor = monitor;
  }

  /**
   * Returns a normalized mesh health report for the UI.
   */
  public getHealthReport(): UIResponse<MeshHealthReport> {
    try {
      const report = this.monitor.generateReport();
      return { ok: true, data: report };
    } catch (error: any) {
      return {
        ok: false,
        error: normalizeUIError(error)
      };
    }
  }
}
