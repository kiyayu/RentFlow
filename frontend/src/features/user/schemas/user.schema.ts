//src/features/user/schemas/user.schema.ts
import { z } from 'zod'

export const updateNameSchema = z.object({
  name: z.string().trim().min(3, 'Name must be at least 3 characters').max(100, 'Name is too long'),
})

export const changeEmailSchema = z.object({
  newEmail: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
})

export type UpdateNameForm = z.infer<typeof updateNameSchema>
export type ChangeEmailForm = z.infer<typeof changeEmailSchema>