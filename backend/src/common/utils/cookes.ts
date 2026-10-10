//src/common/utils/cookies.ts
import { Response } from "express";
import {env} from '../../config/env.js'


const isProd = env.nodeEnv === 'production'
const refreshTokenPath = '/api/auth/refresh-token'

export const setAccessTokenCookie = (res:Response, token:string): void => {
    res.cookie('accessToken', token,{
        httpOnly:true,
        secure:isProd,
        sameSite: isProd ? 'strict' : 'lax',
        maxAge: 15 *60 * 1000,
        path:'/',
        signed:true
    })
}

export const setRefreshTokenCookie = (res:Response, token:string):void => {
 res.cookie("refreshToken", token, {
    httpOnly:true,
    secure:isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: refreshTokenPath,
    signed:true
 })
}

export const clearAuthCookie = (res:Response) : void => {
    res.clearCookie('accessToken', {
        httpOnly:true,
        secure:isProd,
        sameSite: isProd ? 'strict' : 'lax',
        path: '/',
        signed:true
    })

    res.clearCookie('refreshToken', {
        httpOnly:true,
        secure: isProd,
        sameSite: isProd? 'strict' : 'lax',
        path: refreshTokenPath,
        signed: true
    })
}
