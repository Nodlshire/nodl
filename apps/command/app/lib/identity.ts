import { NextRequest } from 'next/server';

/**
 * Resolves identity metadata from the Authorization header (JWT).
 * This is used to hydrate the backend with required X-Header identity context
 * during Phase 4 development where mock JWTs are in use.
 */
export function resolveIdentityHeaders(req: NextRequest): Record<string, string> {
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    const headers: Record<string, string> = { 
        'Authorization': authHeader,
        'Cookie': req.headers.get('cookie') || '',
        'X-User-ID': req.headers.get('x-user-id') || '100001-0426-01-AA',
        'X-User-Role': req.headers.get('x-user-role') || 'management'
    };

    if (!token) return headers;

    try {
        const payloadStr = token.split('.')[1];
        if (!payloadStr) return headers;

        const payload = JSON.parse(Buffer.from(payloadStr, 'base64').toString());
        
        // Canonical Owner Resolution
        if (payload.email === 'stephen@wnode.one' || payload.email === 'stephen@wnode.one') {
            headers['X-Owner-Email'] = 'stephen@wnode.one';
            headers['X-Owner-ID'] = '100001-0426-01-AA';
        }

        // Standard RBAC Resolution
        headers['X-User-ID'] = payload.sub || payload.email;
        headers['X-User-Role'] = payload.role || 'visitor';
        
    } catch (e) {
        console.error('[Identity Resolver] Failed to decode JWT:', e);
    }

    return headers;
}
