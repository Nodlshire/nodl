import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith('/releases')) {
    return NextResponse.next();
  }
  const isApiPage = path.startsWith('/api');

  if (isApiPage) {
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const session = request.cookies.get('nodlr_session')?.value || request.cookies.get('cmd_session')?.value || request.cookies.get('nodl_session')?.value || bearerToken;
    const isPublicApi = path === '/api/account/me' || 
                        path.startsWith('/api/auth') || 
                        path.startsWith('/api/nodes') || 
                        path.startsWith('/api/cmd') ||
                        path.startsWith('/api/avatar') || 
                        path.startsWith('/api/discord') || 
                        path.startsWith('/api/v1/') || 
                        path.startsWith('/api/download');

    if (!session && !isPublicApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
  response.headers.set('CDN-Cache-Control', 'no-store');
  response.headers.set('Cloudflare-CDN-Cache-Control', 'no-store');
  response.headers.set('Surrogate-Control', 'no-store');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.webp|releases|releases/).*)',
  ],
};
