import type { Response } from "express";
import Project from "../models/Project.js";
import type { AuthRequest } from "../types/auth.js";
import logger from "../config/logger.js";

/**
 * @route   GET /api/v1/projects
 * @desc    Get user's active projects
 * @access  Private
 */
export const getMyProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const projects = await Project.find({ client: userId })
      .populate("business")
      .populate("package")
      .sort({ createdAt: -1 });

    logger.info(`📋 [PROJECT] Retrieved ${projects.length} projects for user ${userId}`);

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error: any) {
    logger.error("❌ [PROJECT] Get projects error", { error: error.message });
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   PATCH /api/v1/projects/:id/status
 * @desc    Update project status (Admin only)
 * @access  Private (Admin)
 */
export const updateProjectStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, note } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        $push: { 
          statusHistory: { 
            status, 
            updatedBy: req.userId, 
            updatedByRole: "admin",
            note,
            createdAt: new Date()
          } 
        } 
      },
      { new: true }
    );

    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    logger.info(`✅ [PROJECT] Status updated to ${status} for project ${project.projectNumber}`);

    return res.status(200).json({ success: true, data: project });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/v1/projects/:id
 * @desc    Get project details
 * @access  Private
 */
export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("business")
      .populate("package")
      .populate("client", "email businessName phone");

    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    // Security: Check if user is the owner or an admin
    if (project.client._id.toString() !== req.userId && req.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    logger.error("❌ [PROJECT] Get project error", { error: error.message });
    return res.status(500).json({ success: false, message: error.message });
  }
};
