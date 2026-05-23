"use server"
import {
  readProducts,
  readStore,
  saveProduct,
  deleteProductById,
  writeStore,
  getProductById,
} from "./db-supabase"
import { STATIC_PRODUCTS, STATIC_STORE } from "./static-data"

export const fetchProducts = async () => {
  try { return await readProducts() } catch { return STATIC_PRODUCTS }
}

export const fetchProduct = async (id: string) => {
  try { return await getProductById(id) } catch { return null }
}

export const searchProducts = async (searchTerm: string) => {
  try {
    const all = await readProducts()
    if (!searchTerm) return all
    const q = searchTerm.toLowerCase()
    return all.filter(p => p.title.toLowerCase().includes(q))
  } catch { return [] }
}

export const getAllStoreConfigs = async () => {
  try { return [await readStore()] } catch { return [STATIC_STORE] }
}

export const updateStoreConfigs = async (id: string, data: object) => {
  try {
    const current = await readStore()
    await writeStore({ ...current, ...(data as any) })
    return true
  } catch { return false }
}

export const createDefaultStoreConfigs = async () => {
  try { return await readStore() } catch { return STATIC_STORE }
}

export const deleteProduct = async (productId: string) => {
  try { return await deleteProductById(productId) } catch { return false }
}

export const createProduct = async (data: object) => {
  try { return await saveProduct(data as any) } catch { return false }
}

export const updateProduct = async (id: string, data: object) => {
  try {
    const existing = await getProductById(id)
    if (!existing) return false
    await saveProduct({ ...existing, ...(data as any) })
    return true
  } catch { return false }
}

// Stubs — sem backend externo
export const fetchUsers = async (): Promise<any[]> => []
export const deleteUser = async (_userId: string): Promise<boolean> => false
export const getUserById = async (_id: string): Promise<any | null> => null
export const extractProduct = async (_url: string): Promise<Record<string, any> | null> => null
export const authUser = async (_data: Record<string, unknown>): Promise<any | false> => false
export const getUser = async (_userId: string, _jwt: string): Promise<any | false> => false
export const createUser = async (_data: object): Promise<any | false> => false
export const updateUser = async (_id: string, _data: object, _image?: File): Promise<boolean> => false
