import * as fs from 'fs';
import * as path from 'path';
import { UIResponse } from '../types';
import { normalizeUIError } from '../errors/normalize';

export class DashboardLogsSurface {
  private logFilePath: string;

  constructor(logFilePath?: string) {
    // Default to the monorepo root where the go CLI writes
    this.logFilePath = logFilePath || path.resolve(process.cwd(), 'wnode-audit.jsonl');
  }

  /**
   * Tails or reads the structured JSON logs for the Operator Dashboard.
   */
  public getLogs(limit: number = 50): UIResponse<any[]> {
    try {
      if (!fs.existsSync(this.logFilePath)) {
        return { ok: true, data: [] };
      }

      const content = fs.readFileSync(this.logFilePath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim() !== '');
      
      const logs = lines
        .slice(-limit)
        .map(line => JSON.parse(line))
        .reverse(); // Newest first

      return { ok: true, data: logs };
    } catch (error: any) {
      return {
        ok: false,
        error: normalizeUIError(error),
      };
    }
  }
}
