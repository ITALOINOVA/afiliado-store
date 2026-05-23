"use client"
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

type TopProduct = {
  custom_id: string
  title: string
  image: string
  total_clicks: number
  current_price: number
  buy_link: string
}

type Stats = {
  totalProducts: number
  publishedProducts: number
  totalClicks: number
  totalViews: number
  topProducts: TopProduct[]
}

export function DashboardStats() {
  const [stats, setStats] = React.useState<Stats | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="h-8 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total de produtos</CardTitle>
            <span className="text-xl">📦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">{stats.publishedProducts} publicados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total de views</CardTitle>
            <span className="text-xl">👁️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground">visitas nas páginas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total de cliques</CardTitle>
            <span className="text-xl">🖱️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground">em botões &ldquo;Comprar&rdquo;</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Taxa de clique</CardTitle>
            <span className="text-xl">📊</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalViews > 0
                ? `${((stats.totalClicks / stats.totalViews) * 100).toFixed(1)}%`
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground">cliques / views</p>
          </CardContent>
        </Card>
      </div>

      {/* Top 10 mais clicados */}
      {stats.topProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">🔥 Top 10 mais clicados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topProducts.map((p, i) => (
                <div key={p.custom_id} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-5 shrink-0">{i + 1}</span>
                  <div className="w-10 h-10 bg-white border rounded overflow-hidden shrink-0">
                    <img src={p.image} alt={p.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground">R$ {formatCurrency(p.current_price)}</p>
                  </div>
                  <span className="text-sm font-bold text-primary shrink-0">
                    {p.total_clicks} cliques
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
