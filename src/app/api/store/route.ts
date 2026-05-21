import { NextRequest, NextResponse } from "next/server"
import { readStore, writeStore } from "@/lib/db"
import { requireAdmin } from "@/lib/auth-server"

export async function GET() {
  return NextResponse.json([readStore()])
}

export async function PUT(req: NextRequest) {
  const authError = requireAdmin(req)
  if (authError) return authError

  const body = await req.json()
  const current = readStore()
  const updated = { ...current, ...body }
  writeStore(updated)
  return NextResponse.json(updated)
}
