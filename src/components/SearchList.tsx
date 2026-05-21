"use client"
import * as React from "react"
import { useSearchParams } from "next/navigation"
import { searchProducts } from "@/lib/api"
import ProductCard from "@/components/ProductCard"
import { Product } from "@/lib/types"

const SearchList = () => {
  const searchParams = useSearchParams()
  // Aceita tanto ?term= (barra de busca) quanto ?q= (links de categoria na Navbar)
  const term = searchParams.get("term") || searchParams.get("q") || ""

  const [products, setProducts] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!term) return
    setLoading(true)
    searchProducts(term)
      .then((res) => setProducts(res ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [term])

  return (
    <div>
      <p className="text-base font-medium mb-1">
        {term
          ? <>Resultados para: <span className="text-primary font-bold">&ldquo;{term}&rdquo;</span></>
          : "Busque por um produto"}
      </p>
      {loading && (
        <p className="text-sm text-muted-foreground my-4">Buscando...</p>
      )}
      {!loading && products.length === 0 && term && (
        <p className="text-sm text-muted-foreground my-4">
          Nenhum produto encontrado para &ldquo;{term}&rdquo;.
        </p>
      )}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {products.map((product) => (
          <ProductCard key={product.customId} product={product} />
        ))}
      </div>
    </div>
  )
}

export default SearchList
