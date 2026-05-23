import Navbar from "@/components/Navbar"
import ProductHero from "@/components/ProductHero"
import { fetchProduct } from "@/lib/api"
import { Product } from "@/lib/types"
import { Metadata, ResolvingMetadata } from "next"

type Props = {
  params: { id: string }
  searchParams: Record<string, string>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product: Product | null = await fetchProduct(params.id)
  return {
    title: product?.title
      ? `${product.title} — JCG Distribuidora`
      : "Produto — JCG Distribuidora",
    description: product?.description ?? "As melhores promoções e ofertas",
    openGraph: {
      title: product?.title ?? "Produto",
      description: "As melhores promoções e ofertas",
      images: product?.image ? [{ url: product.image }] : [],
      locale: "pt_BR",
      type: "website",
    },
  }
}

// Server Component: busca o produto no servidor e passa como prop
export default async function ProductPage({ params }: Props) {
  const product = await fetchProduct(params.id)

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-8">
        <ProductHero product={product} />
      </main>
    </>
  )
}
