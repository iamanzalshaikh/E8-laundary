import express from "express";
import {
  scrapeBusinessInfo,
  createOrUpdateBusiness,
  getMyBusiness,
  deleteBusiness,
} from "../controllers/businessController.js";
import isAuth from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router: express.Router = express.Router();

// All routes require authentication
router.use(isAuth);

/**
 * @route   POST /api/v1/business/scrape
 * @desc    Scrape business data from URL (auto-fill)
 * @access  Private
 */
router.post("/scrape", scrapeBusinessInfo);

/**
 * @route   POST /api/v1/business
 * @desc    Create or update business information
 * @access  Private
 */
router.post("/", upload.array("photos", 10), createOrUpdateBusiness);

/**
 * @route   GET /api/v1/business
 * @desc    Get user's business information
 * @access  Private
 */
router.get("/", getMyBusiness);

/**
 * @route   DELETE /api/v1/business
 * @desc    Delete user's business information
 * @access  Private
 */
router.delete("/", deleteBusiness);

export default router;
