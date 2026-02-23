import express, { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser,
  sendOTP,
  verifyOTP,
  resetPassword,
} from "../controllers/authController.js";
import isAuth from "../middleware/auth.middleware.js";

const router: Router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post("/refresh-token", refreshToken);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post("/logout", logout);

/**
 * @route   POST /api/v1/auth/send-otp
 * @desc    Send OTP for password reset
 * @access  Public
 */
router.post("/send-otp", sendOTP);

/**
 * @route   POST /api/v1/auth/verify-otp
 * @desc    Verify OTP for password reset
 * @access  Public
 */
router.post("/verify-otp", verifyOTP);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password
 * @access  Public
 */
router.post("/reset-password", resetPassword);

// ============================================
// PROTECTED ROUTES
// ============================================

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get("/me", isAuth, getCurrentUser);

export default router;
