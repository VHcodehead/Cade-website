import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  if (host.startsWith('vlacovision.com')) {
    const { pathname, search, hash } = request.nextUrl;
    return NextResponse.redirect(
      `https://www.vlacovision.com${pathname}${search}${hash}`,
      { status: 301 }
    );
  }
}

export const config = {
  matcher: [
    '/((?!admin|api|_next/static|_next/image|favicon.ico).*)',
  ],
};
