// src/common/utils/jwt.ts
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { z } from 'zod';
import { env } from '../../config/env.js';
import { ApiError } from '../errors/apiErrors.js';
import { AuthTypes, UserRole } from '../../types/authTypes.js';
import { Types } from 'mongoose';


const accessSecret: Uint8Array = new TextEncoder().encode(env.jwtAccessSecret);
const refreshSecret: Uint8Array = new TextEncoder().encode(env.jwtRefreshSecret);

 

export interface TokenPayload extends JWTPayload {
    role: UserRole;
    sub: string;  
    name:string
    email:string
}

const accessTokenClaimsSchema = z.object({
    role: z.enum(['staff', 'admin', 'customer']),
    name:z.string(),
    email:z.string(),
    sub: z.string(),
});


export const signAccessToken = async (role: UserRole, userId: Types.ObjectId, name:string, email:string): Promise<string> => {
    return new SignJWT({ role, name, email })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(userId.toString())
        .setIssuedAt()
        .setExpirationTime(env.jwtAccessExpiresIn)  
        .sign(accessSecret);
};

export const signRefreshToken = async (userId: string): Promise<string> => {
    return new SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(userId)
        .setIssuedAt()
        .setExpirationTime(env.jwtRefreshExpiresIn)  
        .sign(refreshSecret);
};

 
export const verifyAccessToken = async (token: string): Promise<AuthTypes> => {
    const { payload } = await jwtVerify(token, accessSecret, {
        algorithms: ['HS256'],
    });

    const parsed = accessTokenClaimsSchema.safeParse(payload);
    if (!parsed.success) {
        throw ApiError.unauthorized('Invalid token payload structure');
    }

    return {
        id:parsed.data.sub, name:parsed.data.name, email:parsed.data.email, role:parsed.data.role};
};

 
export const verifyRefreshToken = async (token: string): Promise<JWTPayload> => {
    const { payload } = await jwtVerify(token, refreshSecret, {
        algorithms: ['HS256'],
    });

    if (!payload.sub) {
        throw ApiError.unauthorized('Invalid token payload structure');
    }

    return payload;
};