import nodemailer from "nodemailer";
import config from "../config/config.js";
import logger from "../config/logger.js";

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: Number(config.SMTP_PORT),
  secure: config.SMTP_SECURE === "true",
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    logger.error(`SMTP Connection Error: ${error.message}`);
  } else {
    logger.info("SMTP Server is ready to take messages");
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
  } catch (error: any) {
    logger.error(`Email Send Error: ${error.message}`);
    throw new Error("Email could not be sent");
  }
};

/**
 * Send Welcome Email
 */
export const sendWelcomeEmail = async (email: string, name: string) => {
  const subject = "Welcome to E8 Productions!";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #2563eb;">Welcome to E8 Productions!</h2>
      <p>Hi ${name || "there"},</p>
      <p>Thank you for joining E8 Productions. We're excited to help you grow your business through our specialized GBP optimization and management services.</p>
      <p>You can now log in to your dashboard to track your projects and manage your business profile.</p>
      <div style="margin: 30px 0;">
        <a href="${config.FRONTEND_URL}/login" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
      </div>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Best regards,<br>The E8 Productions Team</p>
    </div>
  `;
  
  await sendEmail({ to: email, subject, html });
};

/**
 * Send Password Reset Email
 */
export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const subject = "Password Reset Request - E8 Productions";
  const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #2563eb;">Password Reset Request</h2>
      <p>You are receiving this email because you (or someone else) requested a password reset for your account.</p>
      <p>Please click on the button below to complete the process:</p>
      <div style="margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p>Best regards,<br>The E8 Productions Team</p>
    </div>
  `;
  
  await sendEmail({ to: email, subject, html });
};

/**
 * Send OTP Email
 */
export const sendOTPEmail = async (email: string, otp: string) => {
  const subject = "Verification Code - E8 Productions";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #2563eb;">Verification Code</h2>
      <p>You are receiving this email because you requested a verification code for your account.</p>
      <p>Your OTP is:</p>
      <div style="margin: 30px 0; background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 5px;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">${otp}</span>
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br>The E8 Productions Team</p>
    </div>
  `;
  
  await sendEmail({ to: email, subject, html });
};
