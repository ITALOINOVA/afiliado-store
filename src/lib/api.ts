"use server"
import { readProducts, readStore, saveProduct, deleteProductById, writeStore } from "./db"
import { STATIC_PRODUCTS, STATIC_STORE } from "./static-data"

export const fetchProducts = async () => {
  try { return readProducts() } catch { return STATIC_PRODUCTS }
}

export const fetchProduct = async (id: string) => {
  try {
    const list = readProducts()
    return list.find(p => p.customId === id || p.id === id) ?? null
  } catch { return null }
}

export const searchProducts = async (searchTerm: string) => {
  try {
    const all = readProducts()
    if (!searchTerm) return all
    const q = searchTerm.toLowerCase()
    return all.filter(p => p.title.toLowerCase().includes(q))
  } catch { return [] }
}

export const getAllStoreConfigs = async () => {
  try { return [readStore()] } catch { return [STATIC_STORE] }
}

export const updateStoreConfigs = async (id: string, data: object) => {
  try {
    const current = readStore()
    writeStore({ ...current, ...(data as any) })
    return true
  } catch { return false }
}

export const createDefaultStoreConfigs = async () => {
  try { return readStore() } catch { return STATIC_STORE }
}

export const deleteProduct = async (productId: string) => {
  try { return deleteProductById(productId) } catch { return false }
}

export const createProduct = async (data: object) => {
  try { return saveProduct(data as any) } catch { return false }
}

export const updateProduct = async (id: string, data: object) => {
  try {
    const list = readProducts()
    const idx = list.findIndex(p => p.id === id || p.customId === id)
    if (idx === -1) return false
    list[idx] = { ...list[idx], ...(data as any) }
    const { writeProducts } = await import("./db")
    writeProducts(list)
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
