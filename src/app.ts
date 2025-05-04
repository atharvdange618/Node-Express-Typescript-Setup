import http from "http";
import express, { Request, Response } from "express";
import helmet from "helmet";
import "./config/logging";
import morgan from "morgan";
import { logger } from "./config/logger";
import cookieParser from "cookie-parser";
import { prisma } from "./utils/prisma";
import { environment } from "./config/environment";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/notFound.middleware";
import { rateLimiterMiddleware } from "./middleware/rateLimiter.middleware";
import passport from "./config/passport";
import expressWinston from "express-winston";
import { devFormat, productionFormat } from "./middleware/loggingHandler";
import { corsMiddleware } from "./middleware/corsHandler";
import emailService from "./services/email.service";
import healthCheckService from "./services/healthcheck.service";
import { requestIdMiddleware } from "./middleware/requestId.middleware";
import { AuthenticatedUser } from "./types/auth";
import { RequestWithUser } from "./types/request";

export const app = express();
export let httpServer: ReturnType<typeof http.createServer>;

// Passport initialization
// app.use(passport.initialize());

export const Main = async () => {
  logging.info("Initializing API");

  // Logging middleware
  app.use(requestIdMiddleware);

  app.use(
    expressWinston.logger({
      winstonInstance: logger,
      msg: "HTTP {{req.method}} {{req.url}}",
      meta: true,
      metaField: null,
      expressFormat: false,
      colorize: false,
      dynamicMeta: (req) => {
        const user = req.user as AuthenticatedUser | undefined;

        return {
          requestId: (req as RequestWithUser).requestId,
          userId: user?.id,
          userRole: user?.role,
        };
      },
    })
  );

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
  app.use(corsMiddleware);
  app.use(rateLimiterMiddleware);

  logging.info("Setting up email service");
  // Email service
  await emailService.verifyTransport();

  logging.info("Connecting to PostgreSQL with Prisma");

  try {
    await prisma.$connect();
    logging.info("Connected to PostgreSQL successfully");
  } catch (error) {
    logging.info("Unable to connect to PostgreSQL");
    logging.error(error);
    // process.exit(1);
  }

  logging.info("Health Check Route");

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

  logging.info("Start Server");

  httpServer = http.createServer(app);
  httpServer.listen(environment.port, () => {
    logging.info(
      "Server Started:" + environment.serverHostname + ":" + environment.port
    );
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
