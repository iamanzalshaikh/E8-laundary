import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  client: mongoose.Types.ObjectId;
  business: mongoose.Types.ObjectId;
  package: mongoose.Types.ObjectId;
  
  // Order Details
  orderNumber: string;
  
  // Package Snapshot (at time of purchase)
  packageSnapshot: {
    name: string;
    price: number;
    managementDays: number;
    features: string[];
  };
  
  // Pricing
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  
  // Payment
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "stripe" | "paypal" | "manual";
  
  // Stripe Integration
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  stripeCustomerId?: string;
  
  // PayPal Integration
  paypalOrderId?: string;
  paypalPayerId?: string;
  
  // Payment Details
  cardLast4?: string;
  cardBrand?: string;
  
  // Timestamps
  paidAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  
  // Refund
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;
  refundedBy?: mongoose.Types.ObjectId;
  
  // Invoice
  invoiceNumber?: string;
  invoiceUrl?: string;
  
  // Order Status (matches project status)
  status: "new" | "in_progress" | "completed" | "cancelled";
  
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    packageSnapshot: {
      name: String,
      price: Number,
      managementDays: Number,
      features: [String],
    },
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal", "manual"],
      default: "stripe",
    },
    stripePaymentIntentId: String,
    stripeChargeId: String,
    stripeCustomerId: String,
    paypalOrderId: String,
    paypalPayerId: String,
    cardLast4: String,
    cardBrand: String,
    paidAt: Date,
    failedAt: Date,
    failureReason: String,
    refundAmount: Number,
    refundReason: String,
    refundedAt: Date,
    refundedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    invoiceNumber: String,
    invoiceUrl: String,
    status: {
      type: String,
      enum: ["new", "in_progress", "completed", "cancelled"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
OrderSchema.index({ client: 1, status: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ stripePaymentIntentId: 1 });
OrderSchema.index({ paypalOrderId: 1 });

// Auto-generate order number
OrderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `E8-${Date.now()}-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

export default mongoose.model<IOrder>("Order", OrderSchema);
