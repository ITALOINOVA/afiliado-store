"use client"
import * as React from "react"
import { Product } from "@/lib/types"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { Button } from "./ui/button"
import ProductList from "./ProductList"
import { toast } from "sonner"
import { OfferTimer } from "./OfferTimer"

function ShareButtons({ product }: { product: Product }) {
  const [copied, setCopied] = React.useState(false)

  function getPageUrl() {
    if (typeof window !== "undefined") return `${window.location.origin}/${product.customId}`
    return `/${product.customId}`
  }

  function shareWhatsApp() {
    const text = `🛒 *${product.title}*\n💰 R$ ${formatCurrency(product.currentPrice)}\n\n${getPageUrl()}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(getPageUrl())
      setCopied(true)
      toast.success("Link copiado!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Não foi possível copiar o link.")
    }
  }

  return (
    <div className="flex gap-2 mt-2">
      <Button variant="outline" size="sm" onClick={shareWhatsApp} className="gap-1.5 text-green-600 border-green-200 hover:bg-green-50">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.558 4.136 1.533 5.875L0 24l6.305-1.51A11.932 11.932 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.017-1.374l-.36-.214-3.732.894.944-3.641-.234-.375A9.818 9.818 0 1 1 12 21.818z"/></svg>
        WhatsApp
      </Button>
      <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5">
        {copied ? "✓ Copiado!" : (
          <>
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copiar link
          </>
        )}
      </Button>
    </div>
  )
}

// Recebe o produto já resolvido pelo Server Component (page.tsx)
const ProductHero = ({ product }: { product: Product | null }) => {
  if (!product) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-lg font-semibold">Produto não encontrado.</p>
        <Link href="/" className="text-primary underline text-sm mt-2 block">
          Voltar à loja
        </Link>
      </div>
    )
  }

  const hasDiscount =
    product.originalPrice > 0 && product.originalPrice > product.currentPrice
  const discountPct = hasDiscount
    ? Math.round((1 - product.currentPrice / product.originalPrice) * 100)
    : 0
  const pixPrice = product.recurrencePrice ?? product.currentPrice * 0.95
  const installmentText =
    product.conditionPayment ||
    `6x de R$ ${formatCurrency(product.currentPrice / 6)} sem juros`

  return (
    <div className="w-full">
      {/* Produto principal */}
      <div className="flex flex-col md:flex-row gap-8 bg-card border rounded-xl p-4 sm:p-6 shadow-sm">
        {/* Imagem */}
        <div className="relative flex items-center justify-center bg-white rounded-lg p-4 md:w-80 md:shrink-0 h-64 md:h-auto">
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full z-10">
              -{discountPct}% OFF
            </span>
          )}
          <img
            src={product.image}
            alt={product.title}
            className="max-h-64 max-w-full object-contain"
          />
        </div>

        {/* Detalhes */}
        <div className="flex flex-col gap-3 flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            {product.category ?? "Produto"}
          </p>

          <h1 className="text-base sm:text-lg font-bold leading-snug">
            {product.title}
          </h1>

          <span className="text-xs font-semibold text-green-600">✓ Frete grátis</span>

          {/* Prova social baseada em cliques reais */}
          {(product.totalClicks ?? 0) >= 5 && (
            <p className="text-xs text-orange-600 font-semibold bg-orange-50 border border-orange-200 px-2 py-1 rounded-md w-fit">
              🔥 {product.totalClicks} {product.totalClicks === 1 ? "pessoa clicou" : "pessoas clicaram"} neste produto
            </p>
          )}

          <div className="flex flex-col gap-1 mt-1">
            {hasDiscount && (
              <p className="text-sm line-through text-muted-foreground">
                De R$ {formatCurrency(product.originalPrice)}
              </p>
            )}
            <p className="text-2xl sm:text-3xl font-extrabold text-primary">
              R$ {formatCurrency(product.currentPrice)}
            </p>
            <p className="text-sm text-green-700 font-semibold">
              R$ {formatCurrency(pixPrice)}{" "}
              <span className="font-normal text-muted-foreground">no Pix</span>
            </p>
            <p className="text-sm text-muted-foreground">{installmentText}</p>
            {product.updatedAt && <OfferTimer updatedAt={product.updatedAt} />}
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              {product.description}
            </p>
          )}

          <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3">
            <a
              href={product.buyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button size="lg" className="w-full text-base font-bold">
                🛒 Comprar no Mercado Livre
              </Button>
            </a>
            <Link href="/" className="sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                ← Ver mais ofertas
              </Button>
            </Link>
          </div>

          <p className="text-[10px] text-muted-foreground mt-1">
            Você será redirecionado ao Mercado Livre para finalizar a compra.
          </p>

          <ShareButtons product={product} />
        </div>
      </div>

      {/* Produtos relacionados */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-7 bg-primary rounded-full" />
          <h2 className="text-lg font-extrabold uppercase tracking-wide">
            Você também pode gostar
          </h2>
          <div className="flex-1 h-px bg-border ml-1" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <ProductList limit={10} grid />
        </div>
      </div>
    </div>
  )
}

export default ProductHero
