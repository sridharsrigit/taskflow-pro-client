import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for token in cookies or headers
  const token = request.cookies.get('accessToken')?.value

  // If no token redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tasks/:path*',
    '/employees/:path*',
    '/ai-assistant/:path*',
  ],
}