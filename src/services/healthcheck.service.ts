import { PrismaClient } from "@prisma/client";
import emailService from "./email.service";
import logging from "../config/logging";

const prisma = new PrismaClient();

export interface HealthStatus {
  status: string;
  timestamp: string;
  database: string;
  email: string;
  [key: string]: any;
}

class HealthCheckService {
  async checkDatabase(): Promise<string> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return "Connected";
    } catch (err) {
      logging.error("Database health check failed:", err);
      return "Disconnected";
    }
  }

  async checkEmailService(): Promise<string> {
    const isEmailConnected = await emailService.verifyTransport();
    return isEmailConnected ? "Connected" : "Disconnected";
  }

  async performHealthCheck(): Promise<HealthStatus> {
    const dbStatus = await this.checkDatabase();
    const emailStatus = await this.checkEmailService();

    return {
      status: "OK",
      timestamp: new Date().toISOString(),
      database: dbStatus,
      email: emailStatus,
    };
  }
}

export default new HealthCheckService();
