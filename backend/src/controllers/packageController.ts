import type { Request, Response } from "express";
import Package from "../models/Package.js";
import logger from "../config/logger.js";
// import Package from "../models/Package";
// import logger from "../config/logger";

/**
 * @route   GET /api/v1/packages
 * @desc    Get all active service packages
 * @access  Public
 */
export const getPackages = async (req: Request, res: Response) => {
  try {
    const packages = await Package.find({ isActive: true }).sort({ displayOrder: 1 });
    
    logger.info("📦 [PACKAGE] Retrieved all active packages");
    
    return res.status(200).json({
      success: true,
      count: packages.length,
      data: packages,
    });
  } catch (error: any) {
    logger.error("❌ [PACKAGE] Get packages error", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Failed to fetch packages",
    });
  }
};

/**
 * @route   POST /api/v1/packages
 * @desc    Create a new package (Admin only)
 * @access  Private (Admin)
 */
export const createPackage = async (req: Request, res: Response) => {
  try {
    const pkg = await Package.create(req.body);
    logger.info(`✅ [PACKAGE] Package created: ${pkg.name} by admin`);
    return res.status(201).json({ success: true, data: pkg });
  } catch (error: any) {
    logger.error("❌ [PACKAGE] Create package error", { error: error.message });
    return res.status(500).json({ success: false, message: error.message });
  }
};
/**
 * @route   PATCH /api/v1/packages/:id
 * @desc    Update a package (Admin only)
 * @access  Private (Admin)
 */
export const updatePackage = async (req: Request, res: Response) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    logger.info(`✅ [PACKAGE] Package updated: ${pkg.name} by admin`);
    return res.status(200).json({ success: true, data: pkg });
  } catch (error: any) {
    logger.error("❌ [PACKAGE] Update package error", { error: error.message });
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   DELETE /api/v1/packages/:id
 * @desc    Delete a package (Admin only)
 * @access  Private (Admin)
 */
export const deletePackage = async (req: Request, res: Response) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    logger.info(`✅ [PACKAGE] Package deleted: ${pkg.name} by admin`);
    return res.status(200).json({ success: true, message: "Package deleted successfully" });
  } catch (error: any) {
    logger.error("❌ [PACKAGE] Delete package error", { error: error.message });
    return res.status(500).json({ success: false, message: error.message });
  }
};
