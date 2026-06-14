import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        let integrationsDir = path.resolve(process.cwd(), '../../integrations');
        if (!fs.existsSync(integrationsDir)) {
            integrationsDir = path.resolve(process.cwd(), 'integrations');
        }
        
        let folders: string[] = [];
        if (fs.existsSync(integrationsDir)) {
            folders = fs.readdirSync(integrationsDir).filter(f => {
                if (f.startsWith('.')) return false;
                const stat = fs.statSync(path.join(integrationsDir, f));
                return stat.isDirectory() && f !== 'standby';
            });
        }

        const integrations = folders.map((folder) => {
            const intPath = path.join(integrationsDir, folder);
            const jsonPath = path.join(intPath, 'integration.json');
            const manifestPath = path.join(intPath, 'manifest.json');
            
            let data: any = {};
            if (fs.existsSync(jsonPath)) {
                try {
                    data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
                } catch (e) {}
            } else if (fs.existsSync(manifestPath)) {
                try {
                    data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                } catch (e) {}
            }

            const now = new Date().toISOString();
            
            return {
                id: data.id,
                name: data.name || data.displayName || folder,
                integration_path: folder,
                joinedAt: data.joinedAt || data.createdAt || now,
                activatedAt: data.activatedAt || now,
                updatedAt: data.updatedAt || now
            };
        });

        return NextResponse.json(integrations);
    } catch (error) {
        console.error('Integrations route error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
