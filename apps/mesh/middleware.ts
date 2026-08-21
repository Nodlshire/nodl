import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function createRedirectResponse(request: NextRequest, targetPath: string): NextResponse {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const hostHeader = request.headers.get('host');
  const rawHost = forwardedHost || hostHeader || 'mesh.wnode.one';
  
  let host = rawHost;
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    host = 'mesh.wnode.one';
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
  const session =
    request.cookies.get('mesh_session') ??
    request.cookies.get('__Host-mesh_session') ??
    request.cookies.get('__Secure-mesh_session');
  const isLoginPage = request.nextUrl.pathname === '/login';

  if (!session && !isLoginPage) {
    return createRedirectResponse(request, '/login');
  }

  if (session && isLoginPage) {
    return createRedirectResponse(request, '/dashboard');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
