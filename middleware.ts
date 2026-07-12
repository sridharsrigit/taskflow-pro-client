import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('accessToken')?.value

  if (!token) {
    return NextResponse.redirect(
      new URL('/login', request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tasks/:path*',
    '/employees/:path*',
    '/ai-assistant/:path*',
    '/settings/:path*',
  ],
}
