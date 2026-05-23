import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createHash } from "crypto"

function makeSessionToken(password: string): string {
  const salt = process.env.SESSION_SECRET ?? "afiliado-store-salt"
  return createHash("sha256").update(password + salt).digest("hex")
}

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const ADMIN_PASS = process.env.ADMIN_PASSWORD

  if (!ADMIN_PASS) {
    return NextResponse.json({ error: "Servidor mal configurado" }, { status: 500 })
  }

  if (password !== ADMIN_PASS) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 })
  }

  // Armazena hash SHA-256 — nunca a senha em texto puro
  const sessionToken = makeSessionToken(ADMIN_PASS)
  const cookieStore = cookies()
  cookieStore.set("admin_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
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
