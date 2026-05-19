import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const COMPUTE_POOLS = [
    { region: 'Europe (FRA)', tier: 'Standard', ths: '42.1', price: '$0.0024', providers: 124 },
    { region: 'NA (US-WEST)', tier: 'Boost', ths: '128.5', price: '$0.0082', providers: 48 },
    { region: 'Asia (Tokyo)', tier: 'Tiny', ths: '18.4', price: '$0.0006', providers: 212 },
    { region: 'SA (SP)', tier: 'Standard', ths: '32.1', price: '$0.0021', providers: 86 },
];

const TRANSACTIONS = [
    { id: '21_MAR_26_RX1', desc: 'Auto-Reload Credits', impact: 'N/A', val: '+$500.00', status: 'Success' },
    { id: '20_MAR_26_EX4', desc: 'Task #8412 Exec Fee', impact: '0.42 kg', val: '-$12.42', status: 'Success' },
    { id: '18_MAR_26_BT1', desc: 'Batch Inference #721', impact: '0.12 kg', val: '-$0.85', status: 'Success' },
];

async function handleProxy(req: NextRequest, method: string, subPath: string) {
    // Route pool requests to pools mock JSON helper
    if (subPath === 'pools' && method === 'GET') {
        return NextResponse.json(COMPUTE_POOLS, { status: 200 });
    }

    // Route transaction history requests to transaction history mock JSON helper
    if (subPath === 'transactions' && method === 'GET') {
        return NextResponse.json(TRANSACTIONS, { status: 200 });
    }

    // Proxy other api requests (like jobs, pricing, logout, etc.) directly to Go backend (8081)
    try {
        const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8081';
        const targetUrl = `${apiUrl}/api/v1/${subPath}${req.nextUrl.search}`;
        
        let requestBody: any = undefined;
        if (method !== 'GET' && method !== 'HEAD') {
            try {
                requestBody = await req.text();
            } catch (e) {}
        }

        const res = await fetch(targetUrl, {
            method,
            cache: 'no-store',
            headers: {
                'Content-Type': req.headers.get('content-type') || 'application/json',
                'Accept': 'application/json',
                'Cookie': req.headers.get('cookie') || '',
                'Authorization': req.headers.get('authorization') || '',
            },
            body: requestBody,
        });

        const contentType = res.headers.get('content-type') || '';
        const bodyText = await res.text();

        if (contentType.includes('text/html') || bodyText.trim().startsWith('<')) {
            return NextResponse.json(
                { error: 'Backend returned HTML response', status: res.status },
                { status: res.status >= 200 && res.status < 300 ? 502 : res.status }
            );
        }

        let jsonData;
        try {
            jsonData = JSON.parse(bodyText);
        } catch (e) {
            return NextResponse.json(
                { error: 'Backend response is not valid JSON', details: bodyText || `Status ${res.status}` },
                { status: 502 }
            );
        }

        const response = NextResponse.json(jsonData, { status: res.status });

        // Forward cookies back to client
        const setCookie = res.headers.get('set-cookie');
        if (setCookie) {
            response.headers.set('set-cookie', setCookie);
        }

        return response;
    } catch (error: any) {
        console.error(`[Mesh API/v1 Catch-All Proxy Error on ${method} /${subPath}]:`, error);
        return NextResponse.json(
            { error: 'Backend provider unreachable', details: error?.message },
            { status: 502 }
        );
    }
}

export async function GET(req: NextRequest, { params }: { params: { path?: string[] } }) {
    const pathSegments = params.path || [];
    return handleProxy(req, 'GET', pathSegments.join('/'));
}

export async function POST(req: NextRequest, { params }: { params: { path?: string[] } }) {
    const pathSegments = params.path || [];
    return handleProxy(req, 'POST', pathSegments.join('/'));
}
