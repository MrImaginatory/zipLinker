import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Add routes that don't require authentication here
const publicRoutes = ["/", "/login", "/signup"]
// Add routes that are typically used for static assets and shouldn't be checked
const publicPathPrefixes = ["/_next", "/favicon.ico", "/images", "/api"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and api routes
  if (publicPathPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Check if user has an auth token (this is a simple check for the prototype)
  const isAuthenticated = request.cookies.has("auth-token")

  const isPublicRoute = publicRoutes.includes(pathname)

  // 1. If user is logged in, they shouldn't see login/signup pages
  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 2. If user is NOT logged in, and trying to access a protected route
  if (!isAuthenticated && !isPublicRoute) {
    // Redirect to login, optionally saving the callback URL
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Configure the paths where middleware should run
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
