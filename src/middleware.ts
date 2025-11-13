import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  const isLoggedRoute = request.nextUrl.pathname.startsWith("/logged")

  if (isLoggedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/logged/:path*"],
}
