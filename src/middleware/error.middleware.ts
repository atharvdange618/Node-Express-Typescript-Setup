import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { AuthenticatedUser } from "../types/auth";
import { RequestWithUser } from "../types/request";
import { logger } from "../config/logger";

export const errorMiddleware = (
  error: Error,
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as AuthenticatedUser | undefined;
  const { requestId } = req;
  const userId = user?.id;
  const userRole = user?.role;

  const method = req.method || "UNKNOWN_METHOD";
  const path = req.path || req.originalUrl || "UNKNOWN_PATH";
  const isProd = process.env.NODE_ENV === "production";

  if (error instanceof ApiError) {
    const statusCode = error.statusCode ?? 500;
    const message = error.message || "Something went wrong";

    logging.error(
      `[${method}] ${path} >> StatusCode:: ${statusCode}, Message:: ${message}`,
      {
        details: error.details,
        stack: error.stack,
      }
    );

    logger.error("API Error handled", {
      method,
      path,
      statusCode,
      message,
      details: error.details,
      stack: error.stack,
      requestId,
      userId,
      userRole,
    });

    return res.status(statusCode).json(error.toJSON());
  }

  // Unexpected errors
  const logPayload: Record<string, any> = {
    method,
    path,
    message: error.message,
    requestId,
    userId,
    userRole,
  };
  if (!isProd) {
    logPayload.stack = error.stack;
  }

  logger.error("Unexpected Error", logPayload);

  res.status(500).json({
    success: false,
    error: {
      code: 500,
      message: "Internal Server Error",
      ...(!isProd && { stack: error.stack }),
      requestId,
    },
  });
};
