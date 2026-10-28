//src/lib/axios.ts
import axios from "axios";
import { env } from "./env";

export const API_BASE_URL = env.apiBaseUrl;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});
let refreshPromise: Promise<void> | null = null;

export const refreshToken = () => {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh-token")
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

let sessionExpiredHandler: (() => void) | null = null;

export const onSessionExpired = (handler: () => void) => {
  sessionExpiredHandler = handler;
};

const SKIP_REFRESH = [
  "user/profile",
  "auth/refresh-token",
  "auth/login",
  "auth/register",
  "auth/verify-otp",
  "auth/resend-otp",
  "auth/forgot-password",
  "auth/reset-password",
];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const url: string = originalRequest.url ?? "";
    if (SKIP_REFRESH.some((part) => url.includes(part))) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshToken();
        return api(originalRequest);
      } catch {
        refreshPromise = null;
        sessionExpiredHandler?.();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
