import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productApi } from '../api/product.api'
import type { CreateProductInput, ProductQuery, UpdateProductInput } from '../types/product.types'

export const productKeys = {
  all: ['products'] as const,
  list: (query: ProductQuery) => ['products', 'list', query] as const,
  managed: (query: ProductQuery) => ['products', 'managed', query] as const,
  detail: (slug: string) => ['products', 'detail', slug] as const,
}

export const useProductList = (query: ProductQuery = {}) =>
  useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => productApi.list(query),
  })

export const useManagedProductList = (query: ProductQuery = {}) =>
  useQuery({
    queryKey: productKeys.managed(query),
    queryFn: () => productApi.listManaged(query),
  })

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productApi.getBySlug(slug),
    enabled: Boolean(slug),
  })

const useProductMutation = <T,>(mutationFn: (variables: T) => Promise<unknown>) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export const useCreateProduct = () => useProductMutation((input: CreateProductInput) => productApi.create(input))
export const useUpdateProduct = () => useProductMutation(({ id, input }: { id: string; input: UpdateProductInput }) => productApi.update(id, input))
export const useArchiveProduct = () => useProductMutation(productApi.archive)
