import { createLogger, format, transports } from "winston";
import { environment } from "./environment";

const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
  const metaStr = Object.keys(metadata).length ? JSON.stringify(metadata) : "";
  return `${timestamp} [${level}]: ${message} ${metaStr}`;
});

const logger = createLogger({
  level: environment.nodeEnv === "production" ? "info" : "debug",
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), myFormat),
    }),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
  exitOnError: false,
});

export default logger;
