import { api } from '@/lib/axios'
import type { CreateProductInput, Product, ProductPage, ProductQuery, UpdateProductInput } from '../types/product.types'

const normalizeProduct = (product: Product): Product => ({
  ...product,
  images: Array.isArray(product.images) ? product.images : [],
  specifications: product.specifications && typeof product.specifications === 'object' ? product.specifications : {},
  rentalPricing: product.rentalPricing ?? { amount: 0, currency: 'ETB', billingUnit: 'day' },
})

export const productApi = {
  list: async (query: ProductQuery = {}): Promise<ProductPage> => {
    const res = await api.get<{ data: Product[]; pagination: ProductPage['pagination'] }>('/products', { params: query })
    return { products: Array.isArray(res.data.data) ? res.data.data.map(normalizeProduct) : [], pagination: res.data.pagination ?? { total: 0, totalPage: 0, currentPage: 1 } }
  },

  create: async (input: CreateProductInput): Promise<Product> => {
    const res = await api.post<{ data: Product }>('/products', input)
    return res.data.data
  },
  listManaged: async (query: ProductQuery = {}): Promise<ProductPage> => {
    const res = await api.get<{ data: Product[]; pagination: ProductPage['pagination'] }>('/products/manage', { params: query })
    return { products: Array.isArray(res.data.data) ? res.data.data.map(normalizeProduct) : [], pagination: res.data.pagination ?? { total: 0, totalPage: 0, currentPage: 1 } }
  },
  update: async (id: string, input: UpdateProductInput): Promise<Product> => {
    const res = await api.patch<{ data: Product }>(`/products/${id}`, input)
    return normalizeProduct(res.data.data)
  },
  archive: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`)
  },
  getBySlug: async (slug: string): Promise<Product> => {
    const res = await api.get<{ data: Product }>(`/products/${slug}`)
    return normalizeProduct(res.data.data)
  },
}
