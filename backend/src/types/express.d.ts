// src/types/express.d.ts
declare global {
  namespace Express {
    interface Request {
      data?: {
        body?: unknown
        params?: unknown
        query?: unknown
      }
      user?: { id: string; role: string; name: string; email: string }
     }
  }
}

export {}