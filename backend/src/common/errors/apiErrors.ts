
export class ApiError extends Error {
    public statusCode: number
    public isOperational:boolean

    constructor(message:string, statusCode:number,isOperational=true){
      super(message)
      this.statusCode    =statusCode
      this.isOperational = isOperational
      Error.captureStackTrace(this, this.constructor)
    }

    static notFound      = (msg:string) => new ApiError(msg,404)
    static unauthorized  = (msg:string) => new ApiError(msg,401)
    static forbidden     = (msg:string) => new ApiError(msg,403)
    static badRequest    = (msg:string) => new ApiError(msg,400)
    static conflict      = (msg:string) => new ApiError(msg,409)
    static tooManyRequests=(msg:string) => new ApiError(msg,429)
    static internal      = (msg='Internal server error') => new ApiError(msg,500)


}