import { MetadataRoute } from "next"
import { readProducts } from "@/lib/db-supabase"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://lojao-jcg.vercel.app"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await readProducts().catch(() => [])

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/${p.customId}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    ...productEntries,
  ]
}
