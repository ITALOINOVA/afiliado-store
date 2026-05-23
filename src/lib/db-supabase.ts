/**
 * db-supabase.ts — camada de dados usando Supabase Postgres.
 * Substitui db.ts (arquivo JSON local) para persistência real na nuvem.
 */
import { createClient } from "@supabase/supabase-js"
import { Product, StoreInfo } from "./types"
import { STATIC_PRODUCTS, STATIC_STORE } from "./static-data"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

function getClient() {
  return createClient(SUPABASE_URL, SUPABASE_KEY)
}

// ── Conversores ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(row: any): Product {
  return {
    id:              row.id,
    customId:        row.custom_id,
    title:           row.title,
    image:           row.image,
    currentPrice:    Number(row.current_price),
    originalPrice:   Number(row.original_price),
    recurrencePrice: row.recurrence_price != null ? Number(row.recurrence_price) : null,
    buyLink:         row.buy_link ?? "",
    announcement:    row.announcement ?? null,
    productCode:     row.product_code ?? "",
    catchyText:      row.catchy_text ?? "",
    conditionPayment: row.condition_payment ?? "",
    website:         row.website ?? "mercadolivre",
    cupom:           row.cupom ?? "",
    cupomValue:      Number(row.cupom_value ?? 0),
    totalClicks:     Number(row.total_clicks ?? 0),
    totalViews:      Number(row.total_views ?? 0),
    published:       Boolean(row.published ?? true),
    category:        row.category ?? undefined,
    description:     row.description ?? undefined,
    createdAt:       row.created_at ?? "",
    updatedAt:       row.updated_at ?? "",
  }
}

function productToRow(p: Product) {
  return {
    id:               p.id,
    custom_id:        p.customId,
    title:            p.title,
    image:            p.image,
    current_price:    p.currentPrice,
    original_price:   p.originalPrice,
    recurrence_price: p.recurrencePrice,
    buy_link:         p.buyLink,
    announcement:     p.announcement,
    product_code:     p.productCode,
    catchy_text:      p.catchyText,
    condition_payment: p.conditionPayment,
    website:          p.website,
    cupom:            p.cupom,
    cupom_value:      p.cupomValue,
    total_clicks:     p.totalClicks,
    total_views:      p.totalViews,
    published:        p.published,
    category:         p.category ?? null,
    description:      p.description ?? null,
    updated_at:       new Date().toISOString(),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToStore(row: any): StoreInfo {
  return {
    id:               row.id,
    storeName:        row.store_name,
    storeDescription: row.store_description ?? null,
    storeLogo:        row.store_logo ?? null,
    storeContact: {
      socialFacebook:  row.social_facebook  ?? null,
      socialInstagram: row.social_instagram ?? null,
      socialTelegram:  row.social_telegram  ?? null,
      socialWhatsApp:  row.social_whatsapp  ?? null,
      address:         row.address          ?? null,
      phone:           row.phone            ?? null,
      email:           row.email            ?? null,
    },
    storeConfig: {
      color:         row.color         ?? "blue",
      navbar:        null,
      banners:       row.banners       ?? [],
      mobileBanners: row.mobile_banners ?? [],
    },
  }
}

// ── Produtos ──────────────────────────────────────────────────────────────────

export async function readProducts(): Promise<Product[]> {
  if (!SUPABASE_URL) return STATIC_PRODUCTS
  const supabase = getClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (error || !data?.length) return STATIC_PRODUCTS
  return data.map(rowToProduct)
}

export async function readAllProducts(): Promise<Product[]> {
  if (!SUPABASE_URL) return STATIC_PRODUCTS
  const supabase = getClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error || !data?.length) return STATIC_PRODUCTS
  return data.map(rowToProduct)
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!SUPABASE_URL) {
    return STATIC_PRODUCTS.find(p => p.customId === id || p.id === id) ?? null
  }
  const supabase = getClient()
  // tenta pelo custom_id primeiro, depois pelo id
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`custom_id.eq.${id},id.eq.${id}`)
    .limit(1)

  if (error || !data?.length) return null
  return rowToProduct(data[0])
}

export async function saveProduct(product: Product): Promise<Product> {
  if (!SUPABASE_URL) return product
  const supabase = getClient()
  const row = productToRow(product)

  const { data, error } = await supabase
    .from("products")
    .upsert(row, { onConflict: "id" })
    .select()
    .single()

  if (error || !data) return product
  return rowToProduct(data)
}

export async function deleteProductById(id: string): Promise<boolean> {
  if (!SUPABASE_URL) return false
  const supabase = getClient()
  const { error, count } = await supabase
    .from("products")
    .delete({ count: "exact" })
    .or(`id.eq.${id},custom_id.eq.${id}`)

  return !error && (count ?? 0) > 0
}

// ── Loja ─────────────────────────────────────────────────────────────────────

export async function readStore(): Promise<StoreInfo> {
  if (!SUPABASE_URL) return STATIC_STORE
  const supabase = getClient()
  const { data, error } = await supabase
    .from("store_config")
    .select("*")
    .limit(1)
    .single()

  if (error || !data) return STATIC_STORE
  return rowToStore(data)
}

export async function writeStore(store: StoreInfo): Promise<void> {
  if (!SUPABASE_URL) return
  const supabase = getClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contact: any = store.storeContact ?? {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config: any  = store.storeConfig  ?? {}

  await supabase
    .from("store_config")
    .upsert({
      id:               store.id,
      store_name:       store.storeName,
      store_description: store.storeDescription,
      store_logo:       store.storeLogo,
      social_facebook:  contact.socialFacebook,
      social_instagram: contact.socialInstagram,
      social_telegram:  contact.socialTelegram,
      social_whatsapp:  contact.socialWhatsApp,
      address:          contact.address,
      phone:            contact.phone,
      email:            contact.email,
      color:            config.color,
      banners:          config.banners,
      mobile_banners:   config.mobileBanners,
      updated_at:       new Date().toISOString(),
    }, { onConflict: "id" })
}
