import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const ADMIN_PASS = process.env.ADMIN_PASSWORD ?? "admin123"

  if (password !== ADMIN_PASS) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 })
  }

  // Seta cookie de sessão (httpOnly, 7 dias)
  const cookieStore = cookies()
  cookieStore.set("admin_session", ADMIN_PASS, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const cookieStore = cookies()
  cookieStore.delete("admin_session")
  return NextResponse.json({ ok: true })
}
