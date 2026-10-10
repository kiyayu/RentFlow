import {hash, verify} from 'argon2'

 
export const hashPassword = async (password:string):Promise<string> => {
  return hash(password)
}
export const comparePassword  = async (password:string, hash:string):Promise<boolean> => {
    return verify(hash , password)
} 