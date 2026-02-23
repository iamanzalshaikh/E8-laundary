import User from "../models/User.js";
import redis from "../config/redis.js";
import { sendOTPEmail } from "./emailService.js";
import logger from "../config/logger.js";

/**
 * Generate a 6-digit OTP
 */
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP Service
 */
export const sendOTPService = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOTP();
  const key = `otp:${email}`;

  // Store OTP in Redis with 10-minute expiry
  await redis.set(key, otp, "EX", 600);

  // Send OTP Email
  await sendOTPEmail(email, otp);
  
  logger.info(`OTP sent to ${email}`);
};

/**
 * Verify OTP Service
 */
export const verifyOTPService = async (email: string, otp: string): Promise<void> => {
  const key = `otp:${email}`;
  const storedOTP = await redis.get(key);

  if (!storedOTP) {
    throw new Error("OTP expired or not found");
  }

  if (storedOTP !== otp) {
    throw new Error("Invalid OTP");
  }

  // OTP is valid, remove it
  await redis.del(key);

  // Mark as verified for password reset (valid for 15 minutes)
  const verifyKey = `verified:${email}`;
  await redis.set(verifyKey, "true", "EX", 900);
  
  logger.info(`OTP verified for ${email}`);
};

/**
 * Reset Password Service
 */
export const resetPasswordService = async (email: string, password: string): Promise<void> => {
  const verifyKey = `verified:${email}`;
  const isVerified = await redis.get(verifyKey);

  if (!isVerified) {
    throw new Error("OTP verification required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("User not found");
  }

  // Update password
  user.password = password;
  await user.save();

  // Clear verification status
  await redis.del(verifyKey);
  
  logger.info(`Password reset successful for ${email}`);
};
