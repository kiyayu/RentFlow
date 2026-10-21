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

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateProductInput) => productApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export const useManagedProductList = (query: ProductQuery = {}) =>
  useQuery({
    queryKey: productKeys.managed(query),
    queryFn: () => productApi.listManaged(query),
  })

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProductInput }) => productApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export const useArchiveProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: productApi.archive,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export const useProduct = (slug: string) => useQuery({ queryKey: productKeys.detail(slug), queryFn: () => productApi.getBySlug(slug), enabled: !!slug })
