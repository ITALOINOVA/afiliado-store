import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export function requireAdmin(req?: NextRequest): NextResponse | null {
  const ADMIN_PASS = process.env.ADMIN_PASSWORD ?? "admin123"
  const cookieStore = cookies()
  const session = cookieStore.get("admin_session")?.value

  if (session !== ADMIN_PASS) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }
  return null
}

export function isAdminLoggedIn(): boolean {
  const ADMIN_PASS = process.env.ADMIN_PASSWORD ?? "admin123"
  const cookieStore = cookies()
  return cookieStore.get("admin_session")?.value === ADMIN_PASS
}
