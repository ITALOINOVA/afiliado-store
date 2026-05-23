import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-server"

/**
 * Extrai o ID do produto (MLB...) de um link de afiliado do Mercado Livre.
 * Suporta os formatos:
 *  - ?pdp_filters=item_id%3AMLB123
 *  - #polycard_client=affiliates&wid=MLB123
 *  - /MLB123- (no path)
 */
function extractMLBId(url: string): string | null {
  // Tenta pelo parâmetro item_id na query string
  const itemIdMatch = url.match(/item_id[%3A:]+([A-Z]{3}\d+)/i)
  if (itemIdMatch) return itemIdMatch[1].toUpperCase()

  // Tenta pelo wid no hash
  const widMatch = url.match(/[?&#]wid=([A-Z]{3}\d+)/i)
  if (widMatch) return widMatch[1].toUpperCase()

  // Tenta no path da URL
  const pathMatch = url.match(/\/([A-Z]{3}\d{7,})/i)
  if (pathMatch) return pathMatch[1].toUpperCase()

  return null
}

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req)
  if (authError) return authError

  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: "URL não informada" }, { status: 400 })

  const mlbId = extractMLBId(url)
  if (!mlbId) {
    return NextResponse.json({ error: "Não foi possível identificar o produto no link" }, { status: 400 })
  }

  try {
    // Busca dados do produto na API pública do Mercado Livre
    const res = await fetch(`https://api.mercadolibre.com/items/${mlbId}`, {
      next: { revalidate: 3600 }, // cache por 1h
    })

    if (!res.ok) {
      return NextResponse.json({ error: "Produto não encontrado no Mercado Livre" }, { status: 404 })
    }

    const item = await res.json()

    // Melhora a qualidade da imagem: troca -I.jpg/-F.jpg por -O.jpg (alta resolução)
    const rawImage: string = item.thumbnail ?? ""
    const image = rawImage
      .replace(/-[A-Z]\.jpg$/, "-O.jpg")
      .replace(/-[A-Z]\.webp$/, "-O.webp")
      .replace(/http:\/\//, "https://")

    // Desconto percentual
    const currentPrice: number = item.price ?? 0
    const originalPrice: number = item.original_price ?? currentPrice

    return NextResponse.json({
      id:            mlbId,
      title:         item.title ?? "",
      image,
      currentPrice,
      originalPrice,
      productCode:   mlbId,
      website:       "mercadolivre",
      // O link de afiliado original fica preservado — o usuário já informou ele
      buyLink:       url,
    })
  } catch {
    return NextResponse.json({ error: "Erro ao buscar produto no Mercado Livre" }, { status: 500 })
  }
}
