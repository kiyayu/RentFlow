import { api } from '@/lib/axios'
import type { InventoryUnit, UnitInput, UnitPage, UnitUpdateInput } from '../types/inventory.types'

export const inventoryApi = {
  list: async (): Promise<UnitPage> => {
    const response = await api.get<{ data: InventoryUnit[]; pagination: UnitPage['pagination'] }>('/units', { params: { page: 1, limit: 100 } })
    return { units: response.data.data ?? [], pagination: response.data.pagination }
  },
  create: async (input: UnitInput): Promise<InventoryUnit> => (await api.post<{ data: InventoryUnit }>('/units', input)).data.data,
  update: async (id: string, input: UnitUpdateInput): Promise<InventoryUnit> => (await api.patch<{ data: InventoryUnit }>(`/units/${id}`, input)).data.data,
  retire: async (id: string): Promise<void> => { await api.delete(`/units/${id}`) },
}
