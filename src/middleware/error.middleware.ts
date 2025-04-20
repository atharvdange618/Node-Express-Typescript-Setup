import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const method = req.method || "UNKNOWN_METHOD";
  const path = req.path || req.originalUrl || "UNKNOWN_PATH";

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

    return res.status(statusCode).json(error.toJSON());
  }

  if (process.env.NODE_ENV !== "production") {
    logging.error(`[${method}] ${path} >> Unexpected Error: ${error.message}`, {
      stack: error.stack,
    });
  } else {
    logging.error(`[${method}] ${path} >> Unexpected Error: ${error.message}`);
  }

  res.status(500).json({
    success: false,
    error: {
      code: 500,
      message: "Internal Server Error",
      ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
    },
  });
};
