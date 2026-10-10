//src/common/utils/oauth.ts
import { randomBytes } from "crypto";
import { redis } from "../../config/redis.js";
import { env } from "../../config/env.js";

import { ApiError } from "../errors/apiErrors.js";
 
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USER_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

export interface GoogleUser {
    sub: string;
    email: string;
    name: string;
    picture?: string;
    email_verified: boolean;
}

export const oauth = {
    buildGoogleUrl: async (): Promise<string> => {
        const state = randomBytes(32).toString("hex");
        await redis.set(`oauthState:${state}`, state, 10 * 60);
        
        const params = new URLSearchParams({
            client_id: env.googleClientId,
            redirect_uri: env.googleRedirectUri,
            response_type: "code",
            scope: "openid email profile",
            state,
            access_type: "offline",
            prompt: "select_account"
        });

        return `${GOOGLE_AUTH_URL}?${params.toString()}`;
    },

    verifyState: async (state: string): Promise<void> => {
        if (!state) throw ApiError.badRequest("Missing OAuth state");
        
        const store = await redis.get(`oauthState:${state}`);
        if (!store) throw ApiError.badRequest("Invalid OAuth state");
        
        await redis.delete(`oauthState:${state}`);
    },

    exchangeGoogleCode: async (code: string): Promise<GoogleUser> => {
        const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: env.googleClientId,
                client_secret: env.googleClientSecret,
                code,
                grant_type: "authorization_code",
                redirect_uri: env.googleRedirectUri
            })
        });

        if (!tokenRes.ok) throw ApiError.badRequest("Google token exchange failed");

        const tokens = await tokenRes.json() as { access_token: string };

        const userRes = await fetch(GOOGLE_USER_URL, {
            headers: { Authorization: `Bearer ${tokens.access_token}` }
        });

        if (!userRes.ok) throw ApiError.badRequest("Google user fetch failed");
        
        const googleUser = await userRes.json() as GoogleUser;
        return googleUser;
    }
};