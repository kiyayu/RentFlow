// src/common/types/authTypes.ts

export type UserRole = 'customer' | 'staff' | 'admin'
export interface AuthTypes {
id:string
name:string
email:string
role:UserRole
}
