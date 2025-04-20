import { prisma } from "../utils/prisma";
import emailService from "./email.service";
import logging from "../config/logging";

export interface HealthStatus {
  status: string;
  timestamp: string;
  database: string;
  email: string;
  [key: string]: any;
}

class HealthCheckService {
  private timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Timeout")), ms);
      promise
        .then((res) => {
          clearTimeout(timer);
          resolve(res);
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  async checkDatabase(): Promise<string> {
    try {
      // Timeout after 2 seconds
      await this.timeout(prisma.$queryRaw`SELECT 1`, 2000);
      return "Connected";
    } catch (err) {
      logging.error("Database health check failed:", err);
      return "Disconnected";
    }
  }

  async checkEmailService(): Promise<string> {
    try {
      const isEmailConnected = await this.timeout(
        emailService.verifyTransport(),
        2000
      );
      return isEmailConnected ? "Connected" : "Disconnected";
    } catch (err) {
      logging.error("Email service health check failed:", err);
      return "Disconnected";
    }
  }

  async performHealthCheck(): Promise<HealthStatus> {
    const [dbStatus, emailStatus] = await Promise.all([
      this.checkDatabase(),
      this.checkEmailService(),
    ]);

    return {
      status: "OK",
      timestamp: new Date().toISOString(),
      database: dbStatus,
      email: emailStatus,
    };
  }
}

export default new HealthCheckService();
