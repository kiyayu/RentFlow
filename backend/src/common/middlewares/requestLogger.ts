import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

export const requestLogger = (req:Request, res:Response, next:NextFunction):void => {
    const start = Date.now()
    logger.debug({
        type: 'request',
        method: req.method,
        url:    req.originalUrl,
        ip:    req.ip || 'unknown',
        userAgent: req.headers['user-agent'],
    }, `${req.method} ${req.originalUrl}`
)

res.on('finish', () => {
    const duration = Date.now() - start
    const status = res.statusCode

    const level = status >= 500 ? 'error'
      : status >= 400           ? 'warn'
      : 'info'
    logger[level](
        {
            type:'request_out',
            method: req.method,
            url: req.originalUrl,
            status,
            duration: `${duration}ms`,
            ip: req.ip,
            userId: req.user?.id

        }, `${req.method} ${req.originalUrl} ${status} ${duration}ms`
    )

    if(duration > 1000){
        logger.warn({
            type: 'request_slow',
            method: req.method,
            url: req.originalUrl,
            duration: `${duration}ms`,
            userId: req.user?.id
        }, `SLOW: ${req.method}, ${req.originalUrl} ${duration}ms`)
    }
   
})
next()
}