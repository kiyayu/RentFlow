import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '../api/inventory.api'
import type { UnitInput, UnitUpdateInput } from '../types/inventory.types'

export const inventoryKeys = { all: ['inventory'] as const, list: () => ['inventory', 'list'] as const }

export const useInventory = (enabled = true) => useQuery({ queryKey: inventoryKeys.list(), queryFn: inventoryApi.list, enabled })

const useInventoryMutation = <T,>(mutationFn: (variables: T) => Promise<unknown>) => {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn, onSuccess: () => queryClient.invalidateQueries({ queryKey: inventoryKeys.all }) })
}

export const useCreateUnit = () => useInventoryMutation((input: UnitInput) => inventoryApi.create(input))
export const useUpdateUnit = () => useInventoryMutation(({ id, input }: { id: string; input: UnitUpdateInput }) => inventoryApi.update(id, input))
export const useRetireUnit = () => useInventoryMutation(inventoryApi.retire)
