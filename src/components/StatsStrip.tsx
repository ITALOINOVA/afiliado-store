"use client"
import * as React from "react"
import { fetchProducts } from "@/lib/api"

export function StatsStrip() {
  const [count, setCount] = React.useState<number | null>(null)

  React.useEffect(() => {
    fetchProducts()
      .then((p) => setCount(p.length))
      .catch(() => {})
  }, [])

  return (
    <div className="w-full bg-primary/5 border-y text-xs font-medium text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
        <span>🛍️ {count !== null ? `${count} ofertas ativas` : "Carregando..."}</span>
        <span>✅ Frete grátis em todos os produtos</span>
        <span>🏷️ Cupons exclusivos</span>
        <span>💳 Parcele sem juros</span>
        <span>🔒 Compra segura via Mercado Livre</span>
      </div>
    </div>
  )
}
