import { ApiError } from "../utils/ApiError";

export const badRequest = (message = "Bad Request", details?: any[]) =>
  new ApiError(400, message, details);

export const unauthorized = (message = "Unauthorized", details?: any[]) =>
  new ApiError(401, message, details);

export const forbidden = (message = "Forbidden", details?: any[]) =>
  new ApiError(403, message, details);

export const notFound = (message = "Not Found", details?: any[]) =>
  new ApiError(404, message, details);

export const conflict = (message = "Conflict", details?: any[]) =>
  new ApiError(409, message, details);

// --- Server Errors ---

export const internalError = (
  message = "Internal Server Error",
  details?: any[]
) => new ApiError(500, message, details);

export const serviceUnavailable = (
  message = "Service Unavailable",
  details?: any[]
) => new ApiError(503, message, details);
