import { Secret } from "jsonwebtoken";
import { env } from "./env";

if (!env.JWT_SECRET) {
  throw new Error("Missing required env var: JWT_SECRET");
}
if (!env.REFRESH_TOKEN_SECRET) {
  throw new Error("Missing required env var: REFRESH_TOKEN_SECRET");
}

export const environment = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,

  allowedOrigins: env.ALLOWED_ORIGINS,

  jwtSecret: env.JWT_SECRET as Secret,
  jwtExpiresIn: env.JWT_EXPIRES_IN || "15m",

  refreshTokenSecret: env.REFRESH_TOKEN_SECRET as Secret,
  refreshTokenExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN || "7d",

  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: env.GOOGLE_CALLBACK_URL,

  smtpHost: env.SMTP_HOST,
  smtpPort: env.SMTP_PORT,
  smtpUser: env.SMTP_USER,
  smtpPass: env.SMTP_PASS,

  dbUrl: env.DATABASE_URL,
  frontendUrl: env.FRONTEND_URL,
  appUrl: env.APP_URL,

  serverHostname: env.SERVER_HOSTNAME,
};
