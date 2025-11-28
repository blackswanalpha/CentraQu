import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get token from cookie
  const token = request.cookies.get('auth_token')?.value
  const isAuthenticated = !!token

  // Public auth routes that don't require authentication
  const publicAuthPaths = [
    '/auth/login',
    '/auth/register',
    '/consulting/login',
    '/consulting/2fa',
  ]

  // Protected routes that require authentication
  const protectedPaths = [
    '/dashboard',
    '/clients',
    '/audits',
    '/consulting/dashboard',
    '/consulting/projects',
    '/consulting/business-development',
    '/consulting/clients',
    '/tasks',
    '/business-development',
    '/finance',
    '/reports',
    '/documents',
    '/employees',
    '/settings',
  ]

  // Check if current path is protected or public auth
  const isPublicAuth = publicAuthPaths.some(path => pathname.startsWith(path))
  const isProtected = !isPublicAuth && protectedPaths.some(path => pathname.startsWith(path))
  const isAuthPage = publicAuthPaths.some(path => pathname.startsWith(path))

  // Redirect to login if accessing protected route without auth
  if (isProtected && !isAuthenticated) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if accessing auth pages while authenticated
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

