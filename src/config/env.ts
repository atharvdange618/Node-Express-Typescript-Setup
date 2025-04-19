import { z } from "zod";
import dotenv from "dotenv";

dotenv.config(); // Load .env into process.env

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z
    .string()
    .default("3000")
    .transform((val) => parseInt(val, 10)),

  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("1h"),

  REFRESH_TOKEN_SECRET: z.string().min(1, "REFRESH_TOKEN_SECRET is required"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),

  GOOGLE_CLIENT_ID: z.string().default(""),
  GOOGLE_CLIENT_SECRET: z.string().default(""),
  GOOGLE_CALLBACK_URL: z
    .string()
    .url("GOOGLE_CALLBACK_URL must be a valid URL")
    .default("http://localhost:3000/api/auth/google/callback"),

  SMTP_HOST: z.string().default("smtp.example.com"),
  SMTP_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default("587"),
  SMTP_USER: z.string().default("smtp_user"),
  SMTP_PASS: z.string().default("smtp_pass"),

  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),

  APP_URL: z.string().url().default("http://localhost:8000"),

  SERVER_HOSTNAME_ENV: z.string().optional(), // raw value from .env if present
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(_env.error.format());
  process.exit(1);
}

const baseEnv = _env.data;

const SERVER_HOSTNAME =
  baseEnv.NODE_ENV === "development"
    ? "localhost"
    : baseEnv.SERVER_HOSTNAME_ENV;

export const env = {
  ...baseEnv,
  SERVER_HOSTNAME,
};
