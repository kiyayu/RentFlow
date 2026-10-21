import { z } from 'zod'

export const unitFormSchema = z.object({
  productId: z.string().min(1, 'Select equipment'),
  assetTag: z.string().trim().min(2, 'Asset tag is required').max(80).regex(/^[a-zA-Z0-9-]+$/, 'Use letters, numbers, and hyphens only'),
  serialNumber: z.string().trim().max(120),
  condition: z.enum(['new', 'good', 'fair', 'damaged']),
  operationalStatus: z.enum(['available', 'maintenance', 'retired']),
  custodyStatus: z.enum(['in_stock', 'checked_out', 'inspection_required']),
  notes: z.string().trim().max(2000),
})

export type UnitFormValues = z.infer<typeof unitFormSchema>
