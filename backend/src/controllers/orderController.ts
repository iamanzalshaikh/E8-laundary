import type { Request, Response } from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";
import Package from "../models/Package.js";
import Project from "../models/Project.js";
import Business from "../models/Business.js";
import User from "../models/User.js";
import config from "../config/config.js";
import logger from "../config/logger.js";
import type { AuthRequest } from "../types/auth.js";

const stripe = new Stripe(config.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,
});

/**
 * @route   POST /api/v1/orders/create-checkout-session
 * @desc    Create Stripe Checkout Session
 * @access  Private (Client)
 */
export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const { packageId, businessId } = req.body;
    const userId = req.userId;

    if (!packageId || !businessId) {
      return res.status(400).json({ success: false, message: "Package and Business ID required" });
    }

    const pkg = await Package.findById(packageId);
    const bus = await Business.findById(businessId);
    const user = await User.findById(userId);

    if (!pkg || !bus || !user) {
      return res.status(404).json({ success: false, message: "Required data not found" });
    }

    // Create a pending order in our database first
    const order = await Order.create({
      client: userId,
      business: businessId,
      package: packageId,
      total: pkg.price,
      currency: "usd",
      paymentStatus: "pending",
      status: "new",
      packageSnapshot: {
        name: pkg.name,
        price: pkg.price,
        managementDays: pkg.managementDays,
        features: pkg.features
      }
    });

    logger.info(`💳 [ORDER] Creating Stripe session for user ${userId}, Order: ${order.orderNumber}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `E8 Productions - ${pkg.name} Package`,
              description: `GBP management for ${bus.businessName}`,
            },
            unit_amount: Math.round(pkg.price * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${config.FRONTEND_URL}/dashboard?payment=success&orderId=${order._id}`,
      cancel_url: `${config.FRONTEND_URL}/pricing?payment=cancelled`,
      metadata: {
        orderId: order._id.toString(),
        userId: userId!.toString(),
      },
      customer_email: user.email,
    });

    // Update order with Stripe session ID
    order.stripePaymentIntentId = session.id;
    await order.save();

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    logger.error("❌ [ORDER] Payment session error", { error: error.message });
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/v1/orders/webhook
 * @desc    Stripe Webhook Handler
 * @access  Public
 */
export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    logger.error(`❌ [WEBHOOK] Sign verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    logger.info(`✅ [WEBHOOK] Payment successful for Order: ${orderId}`);

    // 1. Update Order Status
    const order = await Order.findById(orderId);
    if (order) {
      order.paymentStatus = "paid";
      order.paidAt = new Date();
      order.status = "in_progress";
      await order.save();

      // 2. Create Project auto-magically
      await Project.create({
        client: order.client,
        order: order._id,
        business: order.business,
        package: order.package,
        status: "new",
        startedAt: new Date(),
      });

      logger.info(`🚀 [PROJECT] Auto-created project for Order: ${order.orderNumber}`);
    }
  }

  res.json({ received: true });
};
