import crypto from "crypto";
import type { Request, Response } from "express";
import User from "../models/User.js";
import {
  signUserAccessToken,
  signUserRefreshToken,
  verifyUserRefreshToken,
} from "../utils/jwt.js";
import logger from "../config/logger.js";
import { sendWelcomeEmail, sendPasswordResetEmail } from "../services/emailService.js";
import { 
  sendOTPService, 
  verifyOTPService, 
  resetPasswordService 
} from "../services/authService.js";

// ============================================
// REGISTER
// ============================================

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, businessName, phone } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      businessName,
      phone,
      role: "client",
    });

    // Generate tokens
    const accessToken = signUserAccessToken(user._id.toString(), user.role);
    const refreshToken = signUserRefreshToken(user._id.toString(), user.role);

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    logger.info(`New user registered: ${email}`);

    // Send Welcome Email (async, don't wait to respond to user)
    sendWelcomeEmail(user.email, user.businessName || "").catch((err) => {
      logger.error(`Welcome email failed for ${email}: ${err.message}`);
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          businessName: user.businessName,
          phone: user.phone,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error: any) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ============================================
// LOGIN
// ============================================

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Generate tokens
    const accessToken = signUserAccessToken(user._id.toString(), user.role);
    const refreshToken = signUserRefreshToken(user._id.toString(), user.role);

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          businessName: user.businessName,
          phone: user.phone,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error: any) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// ============================================
// REFRESH TOKEN
// ============================================

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
      return;
    }

    // Verify refresh token
    const decoded = verifyUserRefreshToken(refreshToken);
    if (!decoded || !decoded.userId) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
      return;
    }

    // Generate new access token
    const newAccessToken = signUserAccessToken(decoded.userId, decoded.role);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error: any) {
    logger.error(`Refresh token error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Token refresh failed",
      error: error.message,
    });
  }
};

// ============================================
// LOGOUT
// ============================================

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error: any) {
    logger.error(`Logout error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

// ============================================
// GET CURRENT USER
// ============================================

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // userId is set by auth middleware
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          businessName: user.businessName,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: any) {
    logger.error(`Get current user error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: error.message,
    });
  }
};
// ============================================
// OTP AUTHENTICATION
// ============================================

/**
 * Send OTP to user's email
 */
export const sendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    
    if (!email) {
      res.status(400).json({ success: false, message: "Email is required" });
      return;
    }

    await sendOTPService(email);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err: any) {
    logger.error("Send OTP Error:", err);
    const status = err.message === "User not found" ? 404 : 500;
    res.status(status).json({ 
      success: false, 
      message: err.message || "Internal server error" 
    });
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ success: false, message: "Email and OTP are required" });
      return;
    }

    await verifyOTPService(email, otp);
    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (err: any) {
    logger.error("Verify OTP Error:", err);
    const status =
      err.message === "User not found"
        ? 404
        : err.message.includes("Invalid") || err.message.includes("expired")
          ? 400
          : 500;
    res.status(status).json({ 
      success: false, 
      message: err.message || "Internal server error" 
    });
  }
};

// ============================================
// PASSWORD RESET (OTP BASED)
// ============================================

/**
 * Reset password using email
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      return;
    }

    await resetPasswordService(email, password);
    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (err: any) {
    logger.error("Reset Password Error:", err);
    const status =
      err.message === "User not found"
        ? 404
        : err.message === "OTP verification required"
          ? 400
          : 500;
    res.status(status).json({ 
      success: false, 
      message: err.message || "Internal server error" 
    });
  }
};
