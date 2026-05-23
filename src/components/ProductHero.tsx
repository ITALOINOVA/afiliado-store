"use client"
import * as React from "react"
import { Product } from "@/lib/types"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { Button } from "./ui/button"
import ProductList from "./ProductList"

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
