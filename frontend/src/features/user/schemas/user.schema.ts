//src/features/user/schemas/user.schema.ts
import { z } from 'zod'

export const updateNameSchema = z.object({
  name: z.string().trim().min(3, 'validation:nameMin').max(100, 'validation:nameMax'),
})

export const changeEmailSchema = z.object({
  newEmail: z.string().trim().min(1, 'validation:emailRequired').email('validation:emailInvalid'),
})

export type UpdateNameForm = z.infer<typeof updateNameSchema>
export type ChangeEmailForm = z.infer<typeof changeEmailSchema>