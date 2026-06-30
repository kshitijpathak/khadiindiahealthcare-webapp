import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const authCookie = request.cookies.getAll().find(
      c => c.name.includes('-auth-token') || c.name === 'supabase-auth-token'
    );
    if (!authCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
