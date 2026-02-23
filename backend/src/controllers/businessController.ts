import type { Response } from "express";
import Business from "../models/Business.js";
import { scrapeBusinessData } from "../services/scraper.service.js";
import type { AuthRequest } from "../types/auth.js";
import logger from "../config/logger.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

/**
 * @route   POST /api/v1/business/scrape
 * @desc    Scrape business data from URL
 * @access  Private (Client)
 */
export const scrapeBusinessInfo = async (req: AuthRequest, res: Response) => {
  try {
    const { url } = req.body;
    const userId = req.userId;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    logger.info(`🔍 [BUSINESS] User ${userId} scraping business data from: ${url}`);

    // Scrape business data
    const scrapedData = await scrapeBusinessData(url);

    logger.info(`✅ [BUSINESS] Scraping successful for user ${userId}`, {
      businessName: scrapedData.businessName,
      dataSource: scrapedData.dataSource,
    });

    return res.status(200).json({
      success: true,
      message: "Business data scraped successfully",
      data: scrapedData,
    });
  } catch (error: any) {
    logger.error("❌ [BUSINESS] Scraping error", {
      userId: req.userId,
      url: req.body.url,
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to scrape business data",
    });
  }
};

/**
 * @route   POST /api/v1/business
 * @desc    Create or update business information
 * @access  Private (Client)
 */
export const createOrUpdateBusiness = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const businessData = { ...req.body };
    const files = req.files as Express.Multer.File[];

    // Handle File Uploads
    if (files && files.length > 0) {
      logger.info(`📸 [BUSINESS] Uploading ${files.length} photos for user ${userId}`);
      const uploadPromises = files.map((file) => uploadOnCloudinary(file.buffer, "laundromat-photos"));
      const uploadResults = await Promise.all(uploadPromises);
      
      // Filter out nulls and add to business data
      const photoUrls = uploadResults.filter((url): url is string => url !== null);
      
      if (businessData.photos) {
        // If photos already provided in body (strings), merge them
        const existingPhotos = Array.isArray(businessData.photos) ? businessData.photos : [businessData.photos];
        businessData.photos = [...existingPhotos, ...photoUrls];
      } else {
        businessData.photos = photoUrls;
      }
    }

    // Handle Operating Hours (Parsing if sent as string from form-data)
    if (typeof businessData.hours === "string") {
      try {
        businessData.hours = JSON.parse(businessData.hours);
      } catch (e) {
        logger.warn("⚠️ [BUSINESS] Failed to parse hours JSON string");
      }
    }

    // Handle Services & Amenities (Parsing if sent as string from form-data)
    if (typeof businessData.services === "string") {
      try {
        businessData.services = JSON.parse(businessData.services);
      } catch (e) {
        logger.warn("⚠️ [BUSINESS] Failed to parse services JSON string");
      }
    }
    
    if (typeof businessData.amenities === "string") {
      try {
        businessData.amenities = JSON.parse(businessData.amenities);
      } catch (e) {
        logger.warn("⚠️ [BUSINESS] Failed to parse amenities JSON string");
      }
    }
    
    if (typeof businessData.categories === "string") {
      try {
        businessData.categories = JSON.parse(businessData.categories);
      } catch (e) {
        logger.warn("⚠️ [BUSINESS] Failed to parse categories JSON string");
      }
    }

    // Check if business already exists for this user
    let business = await Business.findOne({ owner: userId });

    if (business) {
      // Update existing business
      business = await Business.findByIdAndUpdate(
        business._id,
        {
          ...businessData,
          owner: userId,
          lastUpdated: new Date(),
        },
        { new: true, runValidators: true }
      );

      logger.info(`✅ [BUSINESS] Business updated`, {
        userId,
        businessId: business?._id,
        businessName: business?.businessName,
      });

      return res.status(200).json({
        success: true,
        message: "Business information updated successfully",
        data: business,
      });
    } else {
      // Create new business
      business = await Business.create({
        ...businessData,
        owner: userId,
      });

      logger.info(`✅ [BUSINESS] Business created`, {
        userId,
        businessId: business._id,
        businessName: business.businessName,
      });

      return res.status(201).json({
        success: true,
        message: "Business information created successfully",
        data: business,
      });
    }
  } catch (error: any) {
    logger.error("❌ [BUSINESS] Create/Update error", {
      userId: req.userId,
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save business information",
    });
  }
};

/**
 * @route   GET /api/v1/business
 * @desc    Get user's business information
 * @access  Private (Client)
 */
export const getMyBusiness = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const business = await Business.findOne({ owner: userId });

    if (!business) {
      logger.warn(`⚠️ [BUSINESS] Business not found for user ${userId}`);
      return res.status(404).json({
        success: false,
        message: "Business information not found",
      });
    }

    logger.info(`✅ [BUSINESS] Business retrieved`, {
      userId,
      businessId: business._id,
      businessName: business.businessName,
    });

    return res.status(200).json({
      success: true,
      data: business,
    });
  } catch (error: any) {
    logger.error("❌ [BUSINESS] Get business error", {
      userId: req.userId,
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch business information",
    });
  }
};

/**
 * @route   DELETE /api/v1/business
 * @desc    Delete user's business information
 * @access  Private (Client)
 */
export const deleteBusiness = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const business = await Business.findOneAndDelete({ owner: userId });

    if (!business) {
      logger.warn(`⚠️ [BUSINESS] Business not found for deletion, user ${userId}`);
      return res.status(404).json({
        success: false,
        message: "Business information not found",
      });
    }

    logger.info(`✅ [BUSINESS] Business deleted`, {
      userId,
      businessId: business._id,
      businessName: business.businessName,
    });

    return res.status(200).json({
      success: true,
      message: "Business information deleted successfully",
    });
  } catch (error: any) {
    logger.error("❌ [BUSINESS] Delete business error", {
      userId: req.userId,
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete business information",
    });
  }
};
