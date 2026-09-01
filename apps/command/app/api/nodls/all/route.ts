import { NextResponse, NextRequest } from 'next/server';
import { resolveIdentityHeaders } from '@/app/lib/identity';
import fs from 'fs';
import path from 'path';

function getFallbackEngineNodes() {
    try {
        const enginePath = path.resolve(process.cwd(), '../../state/engine.json');
        if (fs.existsSync(enginePath)) {
            const raw = fs.readFileSync(enginePath, 'utf8');
            const parsed = JSON.parse(raw);
            if (parsed && parsed.nodes) {
                return Object.values(parsed.nodes);
            }
        }
    } catch (e) {
        console.error('Failed to read fallback engine.json:', e);
    }
    return [];
}

export async function GET(req: NextRequest) {
    const BACKEND_URL = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';
    const headers = resolveIdentityHeaders(req);
    
    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/nodes?scope=all`, { 
            headers,
            cache: 'no-store' 
        });
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length >= 4) {
                return NextResponse.json(data);
            }
        }
    } catch (error) {
        console.warn('Nodls backend fetch warning, using engine.json SOT fallback');
    }

    const fallbackNodes = getFallbackEngineNodes();
    return NextResponse.json(fallbackNodes);
}
