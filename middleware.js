import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

// Paths that require authentication
const authPaths = ["/dashboard", "/profile"]

// Paths that require admin authentication
const adminPaths = ["/admin"]

export async function middleware(request) {
  const path = request.nextUrl.pathname

  // Check if path requires authentication
  const isAuthPath = authPaths.some((ap) => path.startsWith(ap))
  const isAdminPath = adminPaths.some((ap) => path.startsWith(ap))

  if (!isAuthPath && !isAdminPath) {
    return NextResponse.next()
  }

  const authToken = request.cookies.get("auth-token")?.value
  const adminToken = request.cookies.get("admin-token")?.value

  // For admin paths, check admin token
  if (isAdminPath) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    try {
      // Verify admin token
      await jwtVerify(
        adminToken,
        new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-do-not-use-in-production"),
      )

      return NextResponse.next()
    } catch (error) {
      console.error("Admin token verification failed:", error)
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  // For auth paths, check auth token
  if (!authToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  try {
    // Verify auth token
    await jwtVerify(
      authToken,
      new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-do-not-use-in-production"),
    )

    return NextResponse.next()
  } catch (error) {
    console.error("Auth token verification failed:", error)
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
