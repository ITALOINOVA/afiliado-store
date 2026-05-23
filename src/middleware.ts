import { NextRequest, NextResponse } from "next/server"

// Web Crypto API (compatível com Edge Runtime)
async function makeSessionToken(password: string): Promise<string> {
  const salt = process.env.SESSION_SECRET ?? "afiliado-store-salt"
  const encoder = new TextEncoder()
  const data = encoder.encode(password + salt)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rota pública do admin (página de login)
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  // Protege /admin e sub-rotas
  if (pathname.startsWith("/admin")) {
    const ADMIN_PASS = process.env.ADMIN_PASSWORD
    const session = request.cookies.get("admin_session")?.value

    if (!ADMIN_PASS || !session) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    const expectedToken = await makeSessionToken(ADMIN_PASS)
    if (session !== expectedToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
