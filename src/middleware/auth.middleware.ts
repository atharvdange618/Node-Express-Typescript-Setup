import { Request, Response, NextFunction } from "express";
import { AuthUtils } from "../utils/auth.utils";
import * as Api from "../factories/apiErrorFactory";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(Api.unauthorized("Authentication token required"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = AuthUtils.verifyAccessToken(token);

    if (!decoded) {
      return next(Api.unauthorized("Invalid or expired token"));
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(Api.unauthorized("Authentication failed", [error]));
  }
};
