import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  if (host === 'vlacovision.com') {
    const url = request.nextUrl.clone();
    url.host = 'www.vlacovision.com';
    return NextResponse.redirect(url, { status: 301 });
  }
}

export const config = {
  matcher: '/(.*)',
};
