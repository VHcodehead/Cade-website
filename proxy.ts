import { NextRequest, NextResponse } from 'next/server'
import { decrypt, SESSION_COOKIE_NAME } from '@/lib/session'

const protectedRoutes = /^\/admin(?!\/login)/
const loginRoute = '/admin/login'

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.test(path)
  const isLoginRoute = path === loginRoute

  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value
  const session = await decrypt(cookie)

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
  }

  if (isLoginRoute && session?.userId) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
