export type UnitCondition = 'new' | 'good' | 'fair' | 'damaged'
export type UnitOperationalStatus = 'available' | 'maintenance' | 'retired'
export type UnitCustodyStatus = 'in_stock' | 'checked_out' | 'inspection_required'

export type InventoryUnit = {
  id: string
  productId: string
  assetTag: string
  serialNumber?: string
  condition: UnitCondition
  operationalStatus: UnitOperationalStatus
  custodyStatus: UnitCustodyStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export type UnitInput = {
  productId: string
  assetTag: string
  serialNumber?: string
  condition?: UnitCondition
  notes?: string
}

export type UnitUpdateInput = Omit<Partial<UnitInput>, 'productId' | 'assetTag'> & {
  operationalStatus?: UnitOperationalStatus
  custodyStatus?: UnitCustodyStatus
}

export type UnitPage = { units: InventoryUnit[]; pagination: { total: number; totalPage: number; currentPage: number } }
