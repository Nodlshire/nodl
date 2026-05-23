import fs from 'fs/promises';
import path from 'path';

export interface ActivityEvent {
    action: string;
    filePath: string;
    fileType: string;
    userEmail: string;
    inviteId?: string;
    timestamp: string;
    ipAddress: string;
}

const ACTIVITY_LOG_PATH = path.join(process.cwd(), 'storage', 'activity.json');

export async function logActivity(event: ActivityEvent) {
    try {
        let logs: ActivityEvent[] = [];
        try {
            const data = await fs.readFile(ACTIVITY_LOG_PATH, 'utf-8');
            logs = JSON.parse(data);
        } catch {
            // File doesn't exist or is invalid
        }
        
        logs.push(event);
        
        // Ensure storage dir exists
        await fs.mkdir(path.dirname(ACTIVITY_LOG_PATH), { recursive: true });
        await fs.writeFile(ACTIVITY_LOG_PATH, JSON.stringify(logs, null, 2));
    } catch (e) {
        console.error('Failed to log activity', e);
    }
}
