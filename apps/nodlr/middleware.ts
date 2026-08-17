import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isApiPage = request.nextUrl.pathname.startsWith('/api');

  if (isApiPage) {
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const session = request.cookies.get('nodlr_session')?.value || request.cookies.get('cmd_session')?.value || request.cookies.get('nodl_session')?.value || bearerToken;
    const isPublicApi = request.nextUrl.pathname === '/api/account/me' || 
                        request.nextUrl.pathname.startsWith('/api/auth') || 
                        request.nextUrl.pathname.startsWith('/api/nodes') || 
                        request.nextUrl.pathname.startsWith('/api/avatar') || 
                        request.nextUrl.pathname.startsWith('/api/discord') || 
                        request.nextUrl.pathname.startsWith('/api/v1/') || 
                        request.nextUrl.pathname.startsWith('/api/download');

    if (!session && !isPublicApi) {
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
