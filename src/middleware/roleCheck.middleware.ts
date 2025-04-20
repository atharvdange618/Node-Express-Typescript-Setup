import { Request, Response, NextFunction } from "express";
import * as Api from "../factories/apiErrorFactory";
import { AuthenticatedUser } from "../types/auth";

export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(Api.unauthorized("User not authenticated"));
      }

      const user = req.user as AuthenticatedUser;

      if (!roles.includes(user.role)) {
        return next(Api.forbidden("Insufficient permissions"));
      }

      next();
    } catch (error) {
      next(Api.internalError("Unexpected role middleware error", [error]));
    }
  };
};
