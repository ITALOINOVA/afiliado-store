"use client"
import * as React from "react"
import { fetchProducts } from "@/lib/api"
import ProductCard from "@/components/ProductCard"
import { Product } from "@/lib/types"

type Tab = "destaques" | "quentes" | "recentes"

const TABS: { id: Tab; label: string }[] = [
  { id: "destaques", label: "⭐ Destaques" },
  { id: "quentes",   label: "🔥 Mais Quentes" },
  { id: "recentes",  label: "🆕 Recentes" },
]

function sortProducts(products: Product[], tab: Tab): Product[] {
  const arr = [...products]
  if (tab === "quentes")  return arr.sort((a, b) => (b.totalClicks ?? 0) - (a.totalClicks ?? 0))
  if (tab === "recentes") return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return arr // destaques = ordem original do banco
}

export function HomeTabs() {
  const [products, setProducts] = React.useState<Product[]>([])
  const [active, setActive]     = React.useState<Tab>("destaques")
  const [page, setPage]         = React.useState(1)
  const PER_PAGE = 20

  React.useEffect(() => {
    fetchProducts().then(setProducts).catch(() => {})
  }, [])

  // Reset página ao trocar aba
  React.useEffect(() => { setPage(1) }, [active])

  const sorted   = sortProducts(products, active)
  const visible  = sorted.slice(0, page * PER_PAGE)
  const hasMore  = visible.length < sorted.length

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-4 py-2 text-sm font-bold transition-colors border-b-2 -mb-px ${
              active === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {visible.map((product) => (
          <ProductCard key={product.customId} product={product} />
        ))}
      </div>

      {/* Ver mais */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-8 py-2.5 rounded-full border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Ver mais ofertas
          </button>
        </div>
      )}
    </div>
  )
}
