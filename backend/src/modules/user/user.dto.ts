//src/modules/user/user.dto.ts
import  {z} from 'zod'
import  {userSchema , updateUserSchema, idSchema, changeEmailSchema, listUsersQuerySchema} from './user.validation.js'
import { UserRole } from '../../types/authTypes.js'


export type CreateUserDTO = z.infer<typeof userSchema>['body']
export type CreateIDDTO = z.infer<typeof idSchema>['params']
export type CreateChangeEmailDTO = z.infer<typeof changeEmailSchema>['body']
export type CreateUpdateDTO = z.infer<typeof updateUserSchema>['body']
export type CreateListUserDTO = z.infer<typeof listUsersQuerySchema>['query']

export interface UserResponseDTO {
    id:     string
    name:   string
    email:  string
    emailVerified:  boolean
    role:UserRole
    createdAt:Date
}