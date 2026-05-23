import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req)
  if (authError) return authError

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Total de produtos e clicks/views agregados
  const { data: totals } = await supabase
    .from("products")
    .select("total_clicks, total_views, published")

  const totalProducts = totals?.length ?? 0
  const publishedProducts = totals?.filter((p) => p.published).length ?? 0
  const totalClicks = totals?.reduce((s, p) => s + (p.total_clicks ?? 0), 0) ?? 0
  const totalViews = totals?.reduce((s, p) => s + (p.total_views ?? 0), 0) ?? 0

  // Top 10 produtos mais clicados
  const { data: topProducts } = await supabase
    .from("products")
    .select("custom_id, title, image, total_clicks, current_price, buy_link")
    .order("total_clicks", { ascending: false })
    .limit(10)

  return NextResponse.json({
    totalProducts,
    publishedProducts,
    totalClicks,
    totalViews,
    topProducts: topProducts ?? [],
  })
}
