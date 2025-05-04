import "express";
import { User } from "@prisma/client";

declare global {
  var logging: {
    log: (message?: any, ...optionalParams: any[]) => void;
    info: (message?: any, ...optionalParams: any[]) => void;
    warn: (message?: any, ...optionalParams: any[]) => void;
    warning: (message?: any, ...optionalParams: any[]) => void;
    error: (message?: any, ...optionalParams: any[]) => void;
    getCallingFunction: (error: Error) => string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, "id" | "email" | "role">;
      requestId?: string;
    }
  }
}
