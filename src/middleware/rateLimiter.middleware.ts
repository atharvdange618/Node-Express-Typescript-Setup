import rateLimit from "express-rate-limit";
import { environment } from "../config/environment";

export const rateLimiterMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: environment.nodeEnv === "production" ? 100 : Infinity,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || req.socket.remoteAddress || "unknown",
  message: {
    success: false,
    message: "Too many requests, please try again later.",
    status: 429,
  },
});
