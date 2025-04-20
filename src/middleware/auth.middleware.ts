import { Request, Response, NextFunction } from "express";
import { AuthUtils } from "../utils/auth.utils";
import * as Api from "../factories/apiErrorFactory";

const extractToken = (authHeader?: string): string | null => {
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  return parts[1];
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      return next(Api.unauthorized("Authentication token required"));
    }

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
