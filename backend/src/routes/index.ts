import express from "express";
import authRoutes from "./authRoutes.js";
import businessRoutes from "./businessRoutes.js";
import packageRoutes from "./packageRoutes.js";
import orderRoutes from "./orderRoutes.js";
import projectRoutes from "./projectRoutes.js";

const router: express.Router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "E8 Productions API",
    timestamp: new Date()
  });
});

// Auth routes (Signup/Login)
router.use("/auth", authRoutes);

// Business routes (Form Submission / Scraping)
router.use("/business", businessRoutes);

// Package routes (Pricing tiers)
router.use("/packages", packageRoutes);

// Order & Payment routes (Stripe Checkout)
router.use("/orders", orderRoutes);

// Project routes (Dashboard Tracking)
router.use("/projects", projectRoutes);

export default router;
