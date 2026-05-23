"use client"
import * as React from "react"
import { fetchProducts } from "@/lib/api"
import ProductCard from "@/components/ProductCard"
import { Product } from "@/lib/types"

const OFFER_DURATION_MS = 48 * 60 * 60 * 1000 // 48h

function isExpiringSoon(product: Product): boolean {
  if (!product.updatedAt) return false
  const expiry  = new Date(product.updatedAt).getTime() + OFFER_DURATION_MS
  const now     = Date.now()
  const remaining = expiry - now
  // Mostra se expira nas próximas 12h, mas ainda não expirou
  return remaining > 0 && remaining <= 12 * 60 * 60 * 1000
}

export function ExpiringOffers() {
  const [products, setProducts] = React.useState<Product[]>([])

  React.useEffect(() => {
    fetchProducts()
      .then((p) => setProducts(p.filter(isExpiringSoon)))
      .catch(() => {})
  }, [])

  if (products.length === 0) return null

  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-7 bg-red-500 rounded-full" />
        <span className="text-2xl">⏳</span>
        <h2 className="text-xl font-extrabold uppercase tracking-wide text-red-600">
          Expirando em Breve
        </h2>
        <div className="flex-1 h-px bg-border ml-1" />
        <span className="text-xs text-red-500 font-semibold bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
          Últimas horas!
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {products.map((p) => (
          <ProductCard key={p.customId} product={p} />
        ))}
      </div>
    </section>
  )
}
