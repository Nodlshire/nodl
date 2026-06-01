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

    // Determine upstream URL based on path domain
    const isNodeRoute = subPath.startsWith('nodes') || subPath.startsWith('nodlrs');
    const isAccountRoute = subPath.startsWith('money') || subPath.startsWith('jobs') || subPath.startsWith('account');

    let apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081";
    if (isAccountRoute) {
        apiUrl = process.env.ACCOUNT_SERVICE_URL || "http://localhost:3002";
    }

    // Proxy the request to the selected backend
    try {
        const targetUrl = `${apiUrl}/api/v1/${subPath}${req.nextUrl.search}`;
        
        let requestBody: any = undefined;
        if (method !== 'GET' && method !== 'HEAD') {
            try {
                requestBody = await req.text();
            } catch (e) {}
        }

        const fetchHeaders: Record<string, string> = {};
        
        req.headers.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            if (lowerKey !== 'host' && lowerKey !== 'cookie') {
                fetchHeaders[key] = value;
            }
        });

        fetchHeaders['X-Wnode-Domain'] = 'mesh';

        const rawCookie = req.headers.get('cookie');
        if (rawCookie) {
            const meshCookie = rawCookie.split(';').find(c => c.trim().startsWith('mesh_session='));
            if (meshCookie) {
                fetchHeaders['Cookie'] = meshCookie.trim();
            }
        }

        const res = await fetch(targetUrl, {
            method,
            headers: fetchHeaders,
            credentials: 'include',
            body: requestBody,
        });

        if (!res.ok) {
            console.warn(`Backend returned ${res.status} for /api/v1/${subPath} from ${apiUrl}`);
            // Mirror CMD/Nodlr pattern: fail gracefully by returning an empty list for nodes
            if (isNodeRoute) {
                return NextResponse.json([]);
            }
            // For other routes, we can just return empty JSON or let the frontend handle the status
            return NextResponse.json({}, { status: res.status });
        }

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

        // Forward cookies back to client properly using getSetCookie
        const setCookies = res.headers.getSetCookie();
        for (const cookieStr of setCookies) {
            response.headers.append('set-cookie', cookieStr);
        }

        return response;
    } catch (error: any) {
        console.error(`[Mesh API/v1 Proxy Error on ${method} /${subPath}]:`, error);
        // Mirror CMD/Nodlr pattern: return empty array for node queries on network failure
        if (isNodeRoute) {
            return NextResponse.json([]);
        }
        return NextResponse.json({}, { status: 502 });
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
