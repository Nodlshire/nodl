import { UIResponse } from '../types';
import { DashboardLogsSurface } from './logs';

export class DashboardWorkflowsSurface {
  private logsSurface: DashboardLogsSurface;

  constructor(logsSurface: DashboardLogsSurface) {
    this.logsSurface = logsSurface;
  }

  /**
   * Fetches the Workflow execution history from the logs.
   */
  public getWorkflowHistory(): UIResponse<any[]> {
    const logsRes = this.logsSurface.getLogs(100);
    if (!logsRes.ok || !logsRes.data) {
      return logsRes;
    }

    const workflows = logsRes.data
      .filter(log => log.event === 'WORKFLOW_EXECUTED' || log.proof)
      .map(log => ({
        workflowId: log.proof ? log.proof.workflowId : 'unknown',
        timestamp: log.timestamp,
        chainId: log.chainId,
        sdkVersion: log.sdkVersion,
        status: log.proof ? 'VERIFIED' : 'FAILED',
      }));

    return { ok: true, data: workflows };
  }
}
