/**
 * db.ts — armazenamento em arquivo JSON local.
 * Funciona em qualquer servidor Node.js (Hostinger VPS, Railway, etc.)
 * sem precisar de banco de dados externo.
 */
import fs from "fs"
import path from "path"
import { Product, StoreInfo } from "./types"
import { STATIC_PRODUCTS, STATIC_STORE } from "./static-data"

const DATA_DIR  = path.join(process.cwd(), "data")
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json")
const STORE_FILE    = path.join(DATA_DIR, "store.json")

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

// ── Produtos ──────────────────────────────────────────────────────────────────

export function readProducts(): Product[] {
  ensureDir()
  if (!fs.existsSync(PRODUCTS_FILE)) {
    // primeira vez: salva o catálogo estático
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(STATIC_PRODUCTS, null, 2))
    return STATIC_PRODUCTS
  }
  try {
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8")) as Product[]
  } catch {
    return STATIC_PRODUCTS
  }
}

export function writeProducts(products: Product[]) {
  ensureDir()
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2))
}

export function getProductById(id: string): Product | null {
  return readProducts().find(p => p.customId === id || p.id === id) ?? null
}

export function saveProduct(product: Product): Product {
  const list = readProducts()
  const idx  = list.findIndex(p => p.id === product.id)
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...product, updatedAt: new Date().toISOString() }
  } else {
    list.unshift({ ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
  }
  writeProducts(list)
  return idx >= 0 ? list[idx] : list[0]
}

export function deleteProductById(id: string): boolean {
  const list    = readProducts()
  const newList = list.filter(p => p.id !== id && p.customId !== id)
  if (newList.length === list.length) return false
  writeProducts(newList)
  return true
}

// ── Loja ─────────────────────────────────────────────────────────────────────

export function readStore(): StoreInfo {
  ensureDir()
  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(STORE_FILE, JSON.stringify(STATIC_STORE, null, 2))
    return STATIC_STORE
  }
  try {
    return JSON.parse(fs.readFileSync(STORE_FILE, "utf-8")) as StoreInfo
  } catch {
    return STATIC_STORE
  }
}

export function writeStore(store: StoreInfo) {
  ensureDir()
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2))
}
