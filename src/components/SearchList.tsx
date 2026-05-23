"use client"
import * as React from "react"
import { useSearchParams } from "next/navigation"
import { searchProducts } from "@/lib/api"
import ProductCard from "@/components/ProductCard"
import { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type SortKey = "relevance" | "price_asc" | "price_desc" | "newest" | "most_clicked"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "relevance",    label: "Relevância" },
  { value: "price_asc",   label: "Menor preço" },
  { value: "price_desc",  label: "Maior preço" },
  { value: "newest",      label: "Mais recente" },
  { value: "most_clicked", label: "🔥 Mais clicados" },
]

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const arr = [...products]
  switch (sort) {
    case "price_asc":   return arr.sort((a, b) => a.currentPrice - b.currentPrice)
    case "price_desc":  return arr.sort((a, b) => b.currentPrice - a.currentPrice)
    case "newest":      return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case "most_clicked":return arr.sort((a, b) => (b.totalClicks ?? 0) - (a.totalClicks ?? 0))
    default:            return arr
  }
}

const SearchList = () => {
  const searchParams = useSearchParams()
  const term = searchParams.get("term") || searchParams.get("q") || ""

  const [allProducts, setAllProducts] = React.useState<Product[]>([])
  const [loading, setLoading]         = React.useState(false)
  const [sort, setSort]               = React.useState<SortKey>("relevance")
  const [minPrice, setMinPrice]       = React.useState("")
  const [maxPrice, setMaxPrice]       = React.useState("")
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  React.useEffect(() => {
    if (!term) return
    setLoading(true)
    searchProducts(term)
      .then((res) => setAllProducts(res ?? []))
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false))
  }, [term])

  const filtered = React.useMemo(() => {
    let list = [...allProducts]
    const min = parseFloat(minPrice)
    const max = parseFloat(maxPrice)
    if (!isNaN(min)) list = list.filter((p) => p.currentPrice >= min)
    if (!isNaN(max)) list = list.filter((p) => p.currentPrice <= max)
    return sortProducts(list, sort)
  }, [allProducts, minPrice, maxPrice, sort])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <p className="text-base font-medium">
          {term ? (
            <>Resultados para: <span className="text-primary font-bold">&ldquo;{term}&rdquo;</span>{" "}
            {!loading && <span className="text-muted-foreground text-sm">({filtered.length} produtos)</span>}
            </>
          ) : (
            "Busque por um produto"
          )}
        </p>

        {term && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltersOpen((v) => !v)}
            className="self-start sm:self-auto"
          >
            {filtersOpen ? "▲ Ocultar filtros" : "▼ Filtrar / Ordenar"}
          </Button>
        )}
      </div>

      {/* Filtros e ordenação */}
      {filtersOpen && (
        <div className="bg-muted/40 border rounded-lg p-4 mb-4 flex flex-wrap gap-4 items-end">
          {/* Ordenação */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Ordenar por</span>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                    sort === opt.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Faixa de preço */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Faixa de preço (R$)</span>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Mín"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24 h-8 text-sm"
                type="number"
                min="0"
              />
              <span className="text-muted-foreground text-sm">—</span>
              <Input
                placeholder="Máx"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24 h-8 text-sm"
                type="number"
                min="0"
              />
              {(minPrice || maxPrice) && (
                <button
                  onClick={() => { setMinPrice(""); setMaxPrice("") }}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <p className="text-sm text-muted-foreground my-4">Buscando...</p>
      )}
      {!loading && filtered.length === 0 && term && (
        <p className="text-sm text-muted-foreground my-4">
          Nenhum produto encontrado para &ldquo;{term}&rdquo;
          {(minPrice || maxPrice) && " com esses filtros de preço"}.
        </p>
      )}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((product) => (
          <ProductCard key={product.customId} product={product} />
        ))}
      </div>
    </div>
  )
}

export default SearchList
