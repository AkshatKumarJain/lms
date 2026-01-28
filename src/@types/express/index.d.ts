import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role?: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}

export {};
