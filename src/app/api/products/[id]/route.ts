import { NextRequest, NextResponse } from "next/server"
import { getProductById, saveProduct, deleteProductById } from "@/lib/db-supabase"
import { requireAdmin } from "@/lib/auth-server"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const product = await getProductById(params.id)
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = requireAdmin(req)
  if (authError) return authError

  const existing = await getProductById(params.id)
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body  = await req.json()
  const saved = await saveProduct({
    ...existing,
    ...body,
    currentPrice:    body.currentPrice  !== undefined ? Number(body.currentPrice)  : existing.currentPrice,
    originalPrice:   body.originalPrice !== undefined ? Number(body.originalPrice) : existing.originalPrice,
    recurrencePrice: body.recurrencePrice !== undefined ? Number(body.recurrencePrice) : existing.recurrencePrice,
    updatedAt: new Date().toISOString(),
  })
  return NextResponse.json(saved)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = requireAdmin(req)
  if (authError) return authError

  const ok = await deleteProductById(params.id)
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return new NextResponse(null, { status: 204 })
}
