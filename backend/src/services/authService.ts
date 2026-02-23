import User from "../models/User.js";
import { sendOTPEmail } from "./emailService.js";
import logger from "../config/logger.js";

/**
 * Simple in-memory store for OTP + verification flags.
 * This avoids any Redis dependency for environments like Render.
 */
const otpStore = new Map<string, { value: string; expiresAt: number }>();

const setWithTTL = (key: string, value: string, ttlSeconds: number) => {
  otpStore.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

const getIfValid = (key: string): string | null => {
  const entry = otpStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(key);
    return null;
  }
  return entry.value;
};

const delKey = (key: string) => {
  otpStore.delete(key);
};

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

  // Store OTP in-memory with 10-minute expiry
  setWithTTL(key, otp, 600);

  // Send OTP Email
  await sendOTPEmail(email, otp);

  logger.info(`OTP sent to ${email}`);
};

/**
 * Verify OTP Service
 */
export const verifyOTPService = async (email: string, otp: string): Promise<void> => {
  const key = `otp:${email}`;
  const storedOTP = getIfValid(key);

  if (!storedOTP) {
    throw new Error("OTP expired or not found");
  }

  if (storedOTP !== otp) {
    throw new Error("Invalid OTP");
  }

  // OTP is valid, remove it
  delKey(key);

  // Mark as verified for password reset (valid for 15 minutes)
  const verifyKey = `verified:${email}`;
  setWithTTL(verifyKey, "true", 900);

  logger.info(`OTP verified for ${email}`);
};

/**
 * Reset Password Service
 */
export const resetPasswordService = async (email: string, password: string): Promise<void> => {
  const verifyKey = `verified:${email}`;
  const isVerified = getIfValid(verifyKey);

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
  delKey(verifyKey);

  logger.info(`Password reset successful for ${email}`);
};
