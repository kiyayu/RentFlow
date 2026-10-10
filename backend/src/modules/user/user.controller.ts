 import { Request, Response } from "express";
  import { sendSuccess } from "../../common/handlers/responseHandler.js";
 import { userService } from "./user.service.js";
import { CreateChangeEmailDTO, CreateListUserDTO, CreateUpdateDTO , SetAvatarDTO} from "./user.dto.js";
import { DEFAULT_PAGE_SIZE } from "./user.constants.js";
  
 export const userController = {
    getUserProfie: async (req:Request, res:Response) => {
        const userId = req.user?.id as string
        const user = await userService.getProfile(userId)
        return sendSuccess({res, data:user, message:'success', })
    },
    updateUserProfile: async (req:Request, res:Response) => {
        const userId = req.user?.id as string
        const data = req.data?.body as CreateUpdateDTO
        const user = await userService.updateProfile(userId, data)
        return sendSuccess({res, data:user, message:'Profile updated'})
    },
    changeUserEmail: async (req:Request, res:Response) => {
        const userId = req.user?.id as string
        const data = req.data?.body as CreateChangeEmailDTO
        const user = await userService.changeEmail(userId, data.newEmail)
        return sendSuccess({res, message:user})

    },
    deactivateUser: async (req:Request, res:Response) => {
        const userId = req.user?.id as string
        const user  = await userService.deactivate(userId)
        return sendSuccess({res, message:user})
    }, 
    hardDeleteUser: async(req:Request, res:Response) => {
        const userId = req.user?.id as string
        const message = await userService.hardDelete(userId)
        return sendSuccess({res, message:message})
    },
  
listUser: async (req: Request, res: Response) => {
  const { page, limit } = req.data?.query as CreateListUserDTO
  const currentPage = Number(page) || 1          // missing page can no longer become NaN
  const pageSize = limit ?? DEFAULT_PAGE_SIZE     // import from user.constants.js
  const { users, total } = await userService.listUsers(currentPage, pageSize)

  return sendSuccess({
    res,
    data: users,
    message: 'success',
    pagination: { total, totalPage: Math.ceil(total / pageSize), currentPage },
  })
},
  setAvatar:  async (req: Request, res: Response) => {
    const { fileKey } = req.data?.body as SetAvatarDTO
    const data = await userService.setAvatar(req.user!.id, fileKey)
    return sendSuccess({ res, data, message: 'Avatar updated' })
  },

  removeAvatar: async (req: Request, res: Response) => {
    const data = await userService.removeAvatar(req.user!.id)
    return sendSuccess({ res, data, message: 'Avatar removed' })
  },
 }