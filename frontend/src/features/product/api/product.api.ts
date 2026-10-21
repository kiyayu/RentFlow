import { api } from '@/lib/axios'
import type { CreateProductInput, Product, ProductPage, ProductQuery, UpdateProductInput } from '../types/product.types'

export const productApi = {
  list: async (query: ProductQuery = {}): Promise<ProductPage> => {
    const res = await api.get<{ data: Product[]; pagination: ProductPage['pagination'] }>('/products', { params: query })
    return { products: res.data.data ?? [], pagination: res.data.pagination }
  },

  create: async (input: CreateProductInput): Promise<Product> => {
    const res = await api.post<{ data: Product }>('/products', input)
    return res.data.data
  },
  listManaged: async (query: ProductQuery = {}): Promise<ProductPage> => {
    const res = await api.get<{ data: Product[]; pagination: ProductPage['pagination'] }>('/products/manage', { params: query })
    return { products: res.data.data ?? [], pagination: res.data.pagination }
  },
  update: async (id: string, input: UpdateProductInput): Promise<Product> => {
    const res = await api.patch<{ data: Product }>(`/products/${id}`, input)
    return res.data.data
  },
  archive: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`)
  },
  getBySlug: async (slug: string): Promise<Product> => {
    const res = await api.get<{ data: Product }>(`/products/${slug}`)
    return res.data.data
  },
}
