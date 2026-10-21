import { z } from 'zod'

const specificationSchema = z.object({
  key: z.string().trim().min(1, 'Specification name is required').max(80),
  value: z.string().trim().min(1, 'Specification value is required').max(500),
})

export const productFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(160),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(5000),
  brand: z.string().trim().max(120),
  amount: z.number().positive('Price must be greater than zero').finite(),
  images: z.array(z.string().url()).max(10),
  specifications: z.array(specificationSchema).max(30),
}).superRefine((data, context) => {
  const keys = new Set<string>()
  data.specifications.forEach((specification, index) => {
    const key = specification.key.toLowerCase()
    if (keys.has(key)) {
      context.addIssue({ code: 'custom', path: ['specifications', index, 'key'], message: 'Specification names must be unique' })
    }
    keys.add(key)
  })
})

export type ProductFormValues = z.infer<typeof productFormSchema>
