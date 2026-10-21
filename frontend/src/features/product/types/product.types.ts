export type ProductPricing = {
  amount: number
  currency: 'ETB'
  billingUnit: 'day'
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  brand?: string
  images: string[]
  specifications: Record<string, string>
  rentalPricing: ProductPricing
  status: 'active' | 'archived'
  createdAt: string
  updatedAt: string
}

export type ProductPage = {
  products: Product[]
  pagination: {
    total: number
    totalPage: number
    currentPage: number
  }
}

export type ProductQuery = {
  page?: number
  limit?: number
}

export type CreateProductInput = {
  name: string
  description: string
  brand?: string
  images: string[]
  specifications: Record<string, string>
  rentalPricing: ProductPricing
}

export type UpdateProductInput = Partial<CreateProductInput> & {
  status?: Product['status']
}
