import { NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"

function makeSessionToken(password: string): string {
  const salt = process.env.SESSION_SECRET ?? "afiliado-store-salt"
  return createHash("sha256").update(password + salt).digest("hex")
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas públicas do admin (login)
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  // Protege /admin e sub-rotas
  if (pathname.startsWith("/admin")) {
    const ADMIN_PASS = process.env.ADMIN_PASSWORD
    const session = request.cookies.get("admin_session")?.value

    if (!ADMIN_PASS || !session || session !== makeSessionToken(ADMIN_PASS)) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    return NextResponse.next()
  }

  // Protege /auth (legacy next-auth)
  const legacyToken =
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("token")?.value

  if (!legacyToken && pathname === "/profile") {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/profile"],
}
