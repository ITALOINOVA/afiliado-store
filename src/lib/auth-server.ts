import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createHash } from "crypto"

// Node.js crypto (para API routes — não roda no Edge Runtime)
function makeSessionToken(password: string): string {
  const salt = process.env.SESSION_SECRET ?? "afiliado-store-salt"
  return createHash("sha256").update(password + salt).digest("hex")
}

export function requireAdmin(req?: NextRequest): NextResponse | null {
  const ADMIN_PASS = process.env.ADMIN_PASSWORD
  if (!ADMIN_PASS) {
    return NextResponse.json({ error: "Servidor mal configurado" }, { status: 500 })
  }
  const expectedToken = makeSessionToken(ADMIN_PASS)
  const cookieStore = cookies()
  const session = cookieStore.get("admin_session")?.value

  if (session !== expectedToken) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }
  return null
}

export function isAdminLoggedIn(): boolean {
  const ADMIN_PASS = process.env.ADMIN_PASSWORD
  if (!ADMIN_PASS) return false
  const expectedToken = makeSessionToken(ADMIN_PASS)
  const cookieStore = cookies()
  return cookieStore.get("admin_session")?.value === expectedToken
}
