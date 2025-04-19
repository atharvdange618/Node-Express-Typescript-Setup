import rateLimit from "express-rate-limit";
import { environment } from "../config/environment";

export const rateLimiterMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: environment.nodeEnv === "production" ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
    status: 429,
  },
});
