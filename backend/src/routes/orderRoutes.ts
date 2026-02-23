import express from "express";
import { createCheckoutSession, stripeWebhook } from "../controllers/orderController.js";
import isAuth from "../middleware/auth.middleware.js";

const router: express.Router = express.Router();

router.post("/create-checkout-session", isAuth, createCheckoutSession);

// Webhook must use express.raw() in app.ts for signature verification
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

export default router;
