import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, json, errors } = format;

export const logger = createLogger({
  level: "info",
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: [
    new transports.DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      zippedArchive: true,
      level: "info",
    }),
  ],
  exitOnError: false,
});
