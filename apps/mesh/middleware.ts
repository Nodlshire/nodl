import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('mesh_session');
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isApiPage = request.nextUrl.pathname.startsWith('/api');
  const isStatic = request.nextUrl.pathname.startsWith('/_next') || 
                   request.nextUrl.pathname.endsWith('.ico') || 
                   request.nextUrl.pathname.endsWith('.webp');

  if (isApiPage || isStatic) {
    return NextResponse.next();
  }

  // Preserve relative URL handling without external host domain redirection
  if (!session && !isLoginPage) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isLoginPage) {
    const dashUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
