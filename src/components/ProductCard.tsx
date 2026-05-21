"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "./ui/button"
import Link from "next/link"
import { Product } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    product.originalPrice > 0 && product.originalPrice > product.currentPrice
  const discountPct = hasDiscount
    ? Math.round((1 - product.currentPrice / product.originalPrice) * 100)
    : 0
  const pixPrice = product.recurrencePrice ?? product.currentPrice * 0.95
  const installmentText =
    product.conditionPayment ||
    `6x de R$ ${formatCurrency(product.currentPrice / 6)}`

  return (
    <Card className="w-full rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col group">
      {/* Imagem */}
      <div className="relative bg-white">
        {hasDiscount && (
          <span className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-tight">
            -{discountPct}%
          </span>
        )}
        <Link href={`/${product.customId}`}>
          <div className="flex items-center justify-center h-40 p-3 overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      </div>

      {/* Info */}
      <CardContent className="flex flex-col flex-1 p-2.5 gap-1 bg-card">
        <Link href={`/${product.customId}`}>
          <p className="text-[11px] sm:text-xs font-medium leading-snug line-clamp-2 min-h-[2.4rem] hover:text-primary transition-colors">
            {product.title}
          </p>
        </Link>

        <span className="text-[10px] font-semibold text-green-600 mt-0.5">
          ✓ Frete grátis
        </span>

        {hasDiscount && (
          <p className="text-[10px] line-through text-muted-foreground">
            R$ {formatCurrency(product.originalPrice)}
          </p>
        )}

        <p className="text-sm sm:text-base font-bold text-primary leading-tight">
          R$ {formatCurrency(product.currentPrice)}
        </p>

        <p className="text-[10px] text-green-700 font-semibold">
          R$ {formatCurrency(pixPrice)}{" "}
          <span className="font-normal text-muted-foreground">no Pix</span>
        </p>

        <p className="text-[10px] text-muted-foreground">{installmentText}</p>

        <Link
          href={product.buyLink ?? `/${product.customId}`}
          target={product.buyLink ? "_blank" : undefined}
          rel={product.buyLink ? "noopener noreferrer" : undefined}
          className="mt-auto pt-2"
        >
          <Button size="sm" className="w-full text-xs font-bold h-8">
            Comprar
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
