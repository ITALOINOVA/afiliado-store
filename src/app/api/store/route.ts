import { NextRequest, NextResponse } from "next/server"
import { readStore, writeStore } from "@/lib/db-supabase"
import { requireAdmin } from "@/lib/auth-server"

export async function GET() {
  return NextResponse.json([await readStore()])
}

export async function PUT(req: NextRequest) {
  const authError = requireAdmin(req)
  if (authError) return authError

  const body    = await req.json()
  const current = await readStore()
  const updated = { ...current, ...body }
  await writeStore(updated)
  return NextResponse.json(updated)
}
