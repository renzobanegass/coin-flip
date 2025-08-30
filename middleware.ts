import { type NextRequest, NextResponse } from "next/server"

export const config = {
  matcher: ["/api/:path*"],
}

export default async function middleware(req: NextRequest) {
  // Skip auth for most endpoints in simplified version
  if (
    req.nextUrl.pathname === "/api/auth/sign-in" ||
    req.nextUrl.pathname.includes("/api/og") ||
    req.nextUrl.pathname.includes("/api/webhook") ||
    req.nextUrl.pathname.includes("/api/test")
  ) {
    return NextResponse.next()
  }

  // For other API routes, just pass through in simplified version
  return NextResponse.next()
}
