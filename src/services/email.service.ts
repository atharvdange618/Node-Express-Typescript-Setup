import nodemailer, { Transporter } from "nodemailer";
import { ApiError } from "../utils/ApiError";
import {
  verificationEmailTemplate,
  confirmationEmailTemplate,
  passwordChangedEmailTemplate,
  forgetPasswordEmailTemplate,
} from "../templates/emailTemplates";
import { environment } from "../config/environment";

interface EmailUser {
  email: string;
  firstName?: string;
  verificationToken?: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
  messageId?: string;
}

class EmailService {
  private transporter: Transporter;
  private readonly sender: string;
  private readonly appUrl: string;

  constructor() {
    const requiredEnvVars = [
      "smtpHost",
      "smtpPort",
      "smtpUser",
      "smtpPass",
      "appUrl",
    ];

    for (const envVar of requiredEnvVars) {
      if (!environment[envVar as keyof typeof environment]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }

    this.transporter = nodemailer.createTransport({
      host: environment.smtpHost,
      port: Number(environment.smtpPort),
      secure: true,
      auth: {
        user: environment.smtpUser,
        pass: environment.smtpPass,
      },
    });

    this.sender = `"Hello Word" <${environment.smtpUser}>`;
    this.appUrl = environment.appUrl as string;
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string
  ): Promise<EmailResponse> {
    try {
      const info = await this.transporter.sendMail({
        from: this.sender,
        to,
        subject,
        html,
      });

      logging.info(`Email sent successfully: ${info.messageId}`);
      return {
        success: true,
        message: "Email sent successfully",
        messageId: info.messageId,
      };
    } catch (error) {
      logging.error("Failed to send email:", error);
      throw new ApiError(500, "Failed to send email", [error]);
    }
  }

  async verifyTransport(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      logging.error("Email transport verification failed:", error);
      return false;
    }
  }

  async sendVerificationEmail(user: EmailUser): Promise<EmailResponse> {
    if (!user.verificationToken) {
      throw new ApiError(400, "Verification token is missing");
    }

    const verificationUrl = `${this.appUrl}/api/auth/verify-email/${user.verificationToken}`;
    const html = verificationEmailTemplate(
      { firstName: user.firstName || "User" },
      verificationUrl
    );

    return this.sendEmail(user.email, "Verify Your Email", html);
  }

  async sendConfirmationEmail(user: EmailUser): Promise<EmailResponse> {
    const html = confirmationEmailTemplate({
      firstName: user.firstName || "User",
    });

    return this.sendEmail(user.email, "Your Email is Verified!", html);
  }

  async sendPasswordChangedEmail(user: EmailUser): Promise<EmailResponse> {
    const html = passwordChangedEmailTemplate({
      firstName: user.firstName || "User",
    });

    return this.sendEmail(user.email, "Your Password Has Been Changed", html);
  }

  async sendForgetPasswordEmail(
    user: EmailUser,
    resetToken: string
  ): Promise<EmailResponse> {
    const resetUrl = `${this.appUrl}/auth/reset-password/${resetToken}`;
    const html = forgetPasswordEmailTemplate(
      { firstName: user.firstName || "User" },
      resetUrl
    );

    return this.sendEmail(user.email, "Reset Your Password", html);
  }

  async closeTransport() {
    this.transporter.close();
  }
}

const emailService = new EmailService();
export default emailService;
