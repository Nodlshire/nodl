import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('nodlr_session')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth') || request.nextUrl.pathname === '/login';
  const isApiPage = request.nextUrl.pathname.startsWith('/api');

  const isPublicFile = request.nextUrl.pathname.endsWith('.wasm') || 
                       request.nextUrl.pathname.endsWith('.webp') ||
                       request.nextUrl.pathname.endsWith('.ico') ||
                       request.nextUrl.pathname.endsWith('.png') ||
                       request.nextUrl.pathname.endsWith('.svg');

  // If no session and trying to access protected page
  if (!session && !isAuthPage && !isPublicFile) {
    if (isApiPage) {
      // Allow the identity and auth endpoints to be handled by the proxy/handler
      if (request.nextUrl.pathname === '/api/account/me' || request.nextUrl.pathname.startsWith('/api/auth')) {
        return NextResponse.next();
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
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
