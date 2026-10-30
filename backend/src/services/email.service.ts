import nodemailer, { type Transporter } from "nodemailer";

import { buildActionEmailTemplate } from "../templates/email/action-email.template";
import { logger } from "../utils/logger";
import { AppError } from "../utils/app-error";

export class EmailService {
  private transporter: Transporter | null = null;
  private readonly appName: string;

  constructor() {
    this.appName = process.env.APP_NAME || "Task Manager";
  }

  private getTransporter(): Transporter {
    if (this.transporter) {
      return this.transporter;
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      throw new Error("SMTP configuration is missing");
    }

    const port = Number(SMTP_PORT);

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error("Invalid SMTP_PORT");
    }

    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    return this.transporter;
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const transporter = this.getTransporter();

      const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

      await transporter.sendMail({
        from: fromEmail,
        to,
        subject,
        html,
      });

      logger.debug(
        { component: "EmailService", subject },
        "Email sent successfully",
      );
    } catch (error: unknown) {
      logger.error(
        {
          err: error,
          component: "EmailService",
        },
        "Failed to send email",
      );

      throw new AppError("Unable to send email at this time", 500);
    }
  }

  async sendVerificationEmail(
    to: string,
    verificationUrl: string,
  ): Promise<void> {
    const subject = `${this.appName} Email Verification`;

    const html = buildActionEmailTemplate({
      heading: "Verify your email",
      message:
        "Please click the button below to verify your email address. This link expires in 24 hours.",
      buttonLabel: "Verify Email",
      actionUrl: verificationUrl,
      appName: this.appName,
    });

    await this.sendEmail(to, subject, html);
  }

  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    const subject = `${this.appName} Password Reset`;

    const html = buildActionEmailTemplate({
      heading: "Reset your password",
      message:
        "Please click the button below to reset your password. This link expires in 15 minutes.",
      buttonLabel: "Reset Password",
      actionUrl: resetUrl,
      appName: this.appName,
    });

    await this.sendEmail(to, subject, html);
  }
}

export const emailService = new EmailService();
