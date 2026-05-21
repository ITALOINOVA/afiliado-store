import { NextRequest, NextResponse } from "next/server"
import { readProducts, saveProduct } from "@/lib/db"
import { requireAdmin } from "@/lib/auth-server"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  return NextResponse.json(readProducts())
}

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req)
  if (authError) return authError

  const body = await req.json()
  const id   = uuidv4()
  const customId = body.title
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 60) + "-" + id.slice(0, 6)

  const product = {
    id, customId,
    title:           body.title        ?? "",
    image:           body.image        ?? "",
    currentPrice:    Number(body.currentPrice)  || 0,
    originalPrice:   Number(body.originalPrice) || 0,
    recurrencePrice: body.recurrencePrice ? Number(body.recurrencePrice) : null,
    buyLink:         body.buyLink      ?? "",
    announcement:    body.announcement ?? null,
    productCode:     body.productCode  ?? "",
    catchyText:      body.catchyText   ?? "",
    conditionPayment: body.conditionPayment ?? "",
    website:         body.website      ?? "mercadolivre",
    cupom:           body.cupom        ?? "",
    cupomValue:      Number(body.cupomValue) || 0,
    totalClicks: 0, totalViews: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: body.published ?? true,
  }

  const saved = saveProduct(product)
  return NextResponse.json(saved, { status: 201 })
}
