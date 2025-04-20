import http from "http";
import express, { Request, Response } from "express";
import helmet from "helmet";
import "./config/logging";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { prisma } from "./utils/prisma";
import { environment } from "./config/environment";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/notFound.middleware";
import { rateLimiterMiddleware } from "./middleware/rateLimiter.middleware";
import passport from "./config/passport";
import { devFormat, productionFormat } from "./middleware/loggingHandler";
import { corsHandler } from "./middleware/corsHandler";
import emailService from "./services/email.service";
import healthCheckService from "./services/healthcheck.service";

export const app = express();
export let httpServer: ReturnType<typeof http.createServer>;

// Passport initialization
// app.use(passport.initialize());

export const Main = async () => {
  logging.info("-------------------------------");
  logging.info("Initializing API");
  logging.info("-------------------------------");

  if (environment.nodeEnv === "production") {
    app.use(morgan(productionFormat));
  } else {
    app.use(morgan(devFormat));
  }

  // Security and parsing middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(helmet());
  app.use(cookieParser());
  app.use(rateLimiterMiddleware);
  app.use(corsHandler);

  logging.info("-------------------------------");
  logging.info("Setting up email service");
  logging.info("-------------------------------");
  // Email service
  await emailService.verifyTransport();

  logging.info("-------------------------------");
  logging.info("Connecting to PostgreSQL with Prisma");
  logging.info("-------------------------------");
  try {
    await prisma.$connect();
    logging.info("-------------------------------");
    logging.info("Connected to PostgreSQL successfully");
    logging.info("-------------------------------");
  } catch (error) {
    logging.info("-------------------------------");
    logging.info("Unable to connect to PostgreSQL");
    logging.error(error);
    logging.info("-------------------------------");
  }

  logging.info("-------------------------------");
  logging.info("Health Check Route");
  logging.info("-------------------------------");
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ status: "OK" });
  });

  app.get("/healthcheck", async (req: Request, res: Response) => {
    try {
      const healthStatus = await healthCheckService.performHealthCheck();
      res.status(200).json(healthStatus);
    } catch (error) {
      logging.error("Health check failed:", error);
      res.status(500).json({
        status: "ERROR",
        timestamp: new Date().toISOString(),
        message: "Health check failed",
      });
    }
  });

  // Not found route
  app.use(notFoundMiddleware);

  // Error Handling
  app.use(
    errorMiddleware as (
      error: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => void
  );

  logging.info("-------------------------------");
  logging.info("Start Server");
  logging.info("-------------------------------");
  httpServer = http.createServer(app);
  httpServer.listen(environment.port, () => {
    logging.info("-------------------------------");
    logging.info(
      "Server Started:" + environment.serverHostname + ":" + environment.port
    );
    logging.info("-------------------------------");
  });

  // Handle uncaught exceptions and rejections
  process.on("uncaughtException", (error: Error) => {
    logging.error("Uncaught Exception:", error);
    Shutdown(() => process.exit(1));
  });

  process.on("unhandledRejection", (reason: any) => {
    logging.error("Unhandled Rejection:", reason);
    Shutdown(() => process.exit(1));
  });
};

export const Shutdown = async (callback: () => void) => {
  logging.info("Server shutting down...");
  try {
    await prisma.$disconnect();
    logging.info("Database disconnected successfully");
    if (httpServer) {
      httpServer.close(() => {
        logging.info("Server closed successfully");
        if (callback) callback();
      });
    }
  } catch (error) {
    logging.error("Error during shutdown:", error);
    if (callback) callback();
  }
};

// Graceful shutdown handling
process.on("SIGTERM", () => {
  logging.info("SIGTERM received");
  Shutdown(() => process.exit(0));
});

process.on("SIGINT", () => {
  logging.info("SIGINT received");
  Shutdown(() => process.exit(0));
});

Main().catch((error) => {
  logging.error("Failed to start server:", error);
  process.exit(1);
});
