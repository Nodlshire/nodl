import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function createRedirectResponse(request: NextRequest, targetPath: string): NextResponse {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const hostHeader = request.headers.get('host');
  const rawHost = forwardedHost || hostHeader || 'cmd.wnode.one';
  
  let host = rawHost;
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    host = 'cmd.wnode.one';
  }
  
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const redirectUrl = `${proto}://${host}${targetPath}`;
  
  return new NextResponse(null, {
    status: 307,
    headers: {
      'Location': redirectUrl,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
    }
  });
}

export function middleware(request: NextRequest) {
  const session = request.cookies.get('cmd_session')?.value;
  const authHeader = request.headers.get('Authorization');
  const hasAuthToken = authHeader && authHeader.startsWith('Bearer ');
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth') || request.nextUrl.pathname === '/login';
  const isApiPage = request.nextUrl.pathname.startsWith('/api');

  const isPublicFile = request.nextUrl.pathname.endsWith('.wasm') || 
                       request.nextUrl.pathname.endsWith('.webp') ||
                       request.nextUrl.pathname.endsWith('.ico');

  // If no session and no auth token and trying to access protected page
  if (!session && !hasAuthToken && !isAuthPage && !isPublicFile) {
    if (isApiPage) {
      if (request.nextUrl.pathname === '/api/account/me' || 
          request.nextUrl.pathname.startsWith('/api/auth') ||
          request.nextUrl.pathname.startsWith('/api/v1/') ||
          request.nextUrl.pathname.startsWith('/api/cmd') ||
          request.nextUrl.pathname.startsWith('/api/discord') ||
          request.nextUrl.pathname.startsWith('/api/tiles') ||
          request.nextUrl.pathname.startsWith('/api/intelligence/event')) {
        return NextResponse.next();
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return createRedirectResponse(request, '/auth/login');
  }

  if (session && isAuthPage) {
    return createRedirectResponse(request, '/');
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.webp).*)',
  ],
};
