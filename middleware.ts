import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value

  // Protected routes
  const protectedRoutes = ["/admin", "/dashboard"]
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Auth routes that should redirect if logged in
  const authRoutes = ["/auth/login", "/auth/signup"]
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // If user is trying to access protected route without session
  if (isProtectedRoute && !sessionToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // If user is logged in and trying to access auth routes, redirect to dashboard
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/auth/:path*"],
}
