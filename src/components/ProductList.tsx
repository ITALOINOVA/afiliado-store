"use client"
import * as React from "react"
import { fetchProducts } from "@/lib/api"
import ProductCard from "@/components/ProductCard"
import { Product } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ProductListProps {
  className?: string
  limit?: number
  offset?: number
  /** Se true, usa display: contents para encaixar no grid do pai */
  grid?: boolean
}

const ProductList = ({
  className,
  limit = 0,
  offset = 0,
  grid = false,
}: ProductListProps) => {
  const [products, setProducts] = React.useState<Product[]>([])

  const fetchProductsAPI = React.useCallback(async () => {
    try {
      const response: Product[] = await fetchProducts()
      if (response) setProducts(response)
    } catch (error) {
      console.error("Erro ao buscar produtos", error)
      setProducts([])
    }
  }, [])

  React.useEffect(() => {
    fetchProductsAPI()
  }, [])

  const slice = products.slice(
    offset,
    limit > 0 ? offset + limit : undefined
  )

  if (grid) {
    // Renderiza apenas os cards (sem wrapper) para o grid do pai
    return (
      <>
        {slice.map((product) => (
          <ProductCard key={product.customId} product={product} />
        ))}
      </>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-wrap justify-center gap-3",
        className
      )}
    >
      {slice.map((product) => (
        <ProductCard key={product.customId} product={product} />
      ))}
    </div>
  )
}

export default ProductList
