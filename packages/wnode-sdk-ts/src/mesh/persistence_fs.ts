import * as fs from 'fs';
import * as path from 'path';
import { MeshSnapshot } from './snapshot';
import { MeshEvent } from './journal';

export class FileSystemPersistenceAdapter {
  constructor(private readonly dataDir: string) {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  public writeSnapshot(snapshotName: string, snapshot: MeshSnapshot): void {
    const snapshotPath = path.join(this.dataDir, `${snapshotName}.json`);
    const data = JSON.stringify(snapshot, null, 2);
    // Write atomically
    const tempPath = `${snapshotPath}.tmp`;
    fs.writeFileSync(tempPath, data, 'utf8');
    fs.renameSync(tempPath, snapshotPath);
  }

  public readSnapshot(snapshotName: string): MeshSnapshot | null {
    const snapshotPath = path.join(this.dataDir, `${snapshotName}.json`);
    if (!fs.existsSync(snapshotPath)) {
      return null;
    }
    const data = fs.readFileSync(snapshotPath, 'utf8');
    return JSON.parse(data) as MeshSnapshot;
  }

  public appendEvent(logName: string, event: MeshEvent): void {
    const logPath = path.join(this.dataDir, `${logName}.jsonl`);
    const line = JSON.stringify(event) + '\n';
    fs.appendFileSync(logPath, line, 'utf8');
  }

  public readEvents(logName: string): MeshEvent[] {
    const logPath = path.join(this.dataDir, `${logName}.jsonl`);
    if (!fs.existsSync(logPath)) {
      return [];
    }
    const data = fs.readFileSync(logPath, 'utf8');
    const lines = data.split('\n').filter(l => l.trim() !== '');
    return lines.map(l => JSON.parse(l) as MeshEvent);
  }
}
