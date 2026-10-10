//src/modules/user/user.validation.ts
import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .max(72);
export const userSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email format'),
    password: passwordSchema,
   }).strict()
 
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100),
  }).strict(),
})

export const idSchema = z.object({
  
  params: z.object({ id: z.string().min(1, 'Id is required') }).strict(),
  
});


export const changeEmailSchema = z.object({
  body: z.object({
    newEmail: z.string().email('Invalid email format'),
  }).strict(),
})

export const listUsersQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }).strict(),
})
