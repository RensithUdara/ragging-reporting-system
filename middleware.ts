import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/auth/login" ||
    path === "/auth/register" ||
    path === "/auth/verify-email" ||
    path === "/admin/login" ||
    path === "/about" ||
    path === "/faq" ||
    path === "/contact" ||
    path === "/privacy" ||
    path === "/how-it-works" ||
    path === "/report" ||
    path === "/check-status" ||
    path.startsWith("/api/")

  // Get the cookies
  const adminSession = request.cookies.get("admin-session")?.value
  const userSession = request.cookies.get("user-session")?.value

  // Check if the path is for admin routes
  if (path.startsWith("/admin") && !isPublicPath) {
    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Check if the path is for authenticated user routes
  if (path.startsWith("/dashboard") && !userSession) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // If user is already logged in, redirect from login/register pages to dashboard
  if ((path === "/auth/login" || path === "/auth/register") && userSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If admin is already logged in, redirect from login page to admin dashboard
  if (path === "/admin/login" && adminSession) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
