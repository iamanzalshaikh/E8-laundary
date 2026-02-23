import mongoose, { Schema, Document } from "mongoose";

export interface IPackage extends Document {
  name: string; // "Basic", "Pro", "Premium"
  slug: string;
  description: string;
  
  // Pricing
  price: number;
  currency: string;
  
  // Features
  features: string[];
  
  // GBP Service Details
  gbpCreation: boolean;
  gbpOptimization: boolean;
  photoUploads: number; // Max photos included
  postFrequency: string; // e.g., "Weekly", "Bi-weekly"
  reviewManagement: boolean;
  analyticsReporting: boolean;
  
  // Management Duration
  managementDays: number; // 30, 60, or 90 days
  
  // Support
  supportLevel: "basic" | "priority" | "dedicated";
  responseTime: string; // e.g., "24 hours", "12 hours"
  
  // Display
  isActive: boolean;
  isPopular: boolean;
  displayOrder: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
    },
    features: [String],
    gbpCreation: {
      type: Boolean,
      default: true,
    },
    gbpOptimization: {
      type: Boolean,
      default: false,
    },
    photoUploads: {
      type: Number,
      default: 10,
    },
    postFrequency: {
      type: String,
      default: "Weekly",
    },
    reviewManagement: {
      type: Boolean,
      default: false,
    },
    analyticsReporting: {
      type: Boolean,
      default: false,
    },
    managementDays: {
      type: Number,
      required: true,
      default: 30,
    },
    supportLevel: {
      type: String,
      enum: ["basic", "priority", "dedicated"],
      default: "basic",
    },
    responseTime: {
      type: String,
      default: "24 hours",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PackageSchema.index({ isActive: 1, displayOrder: 1 });
PackageSchema.index({ slug: 1 });

export default mongoose.model<IPackage>("Package", PackageSchema);
