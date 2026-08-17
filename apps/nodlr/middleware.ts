import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isApiPage = path.startsWith('/api');

  console.log(`[FORENSIC TELEMETRY] Path: ${path} | Method: ${request.method} | Host: ${request.headers.get('host')} | Cookie: ${request.headers.get('cookie')} | Auth: ${request.headers.get('authorization')}`);

  if (isApiPage) {
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const session = request.cookies.get('nodlr_session')?.value || request.cookies.get('cmd_session')?.value || request.cookies.get('nodl_session')?.value || bearerToken;
    const isPublicApi = path === '/api/account/me' || 
                        path.startsWith('/api/auth') || 
                        path.startsWith('/api/nodes') || 
                        path.startsWith('/api/avatar') || 
                        path.startsWith('/api/discord') || 
                        path.startsWith('/api/v1/') || 
                        path.startsWith('/api/download');

    if (!session && !isPublicApi) {
      console.warn(`[FORENSIC TELEMETRY REJECT] 401 Unauthorized for path: ${path}`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.webp (institutional logo)
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.webp).*)',
  ],
};
