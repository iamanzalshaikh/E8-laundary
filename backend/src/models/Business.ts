import mongoose, { Schema, Document } from "mongoose";

export interface IBusiness extends Document {
  owner: mongoose.Types.ObjectId;
  
  // Source Links (for auto-scraping)
  websiteUrl?: string;
  googleBusinessUrl?: string;
  
  // Auto-scraped & Editable Data
  businessName: string;
  
  // Address
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Contact
  phone: string;
  email?: string;
  
  // Business Hours
  hours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  
  // Services & Amenities
  services: string[];
  amenities: string[];
  
  // Description
  description?: string;
  
  // Categories
  categories: string[];
  
  // Media
  photos: string[];
  videos: string[];
  logo?: string;
  
  // Data Source
  dataSource: "manual" | "website_scrape" | "google_scrape";
  scrapedAt?: Date;
  lastUpdated?: Date;
  
  // Verification
  isVerified: boolean;
  verifiedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema: Schema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    websiteUrl: String,
    googleBusinessUrl: String,
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: "USA" },
    },
    phone: {
      type: String,
      required: true,
    },
    email: String,
    hours: {
      monday: {
        open: { type: String, default: "07:00" },
        close: { type: String, default: "22:00" },
        closed: { type: Boolean, default: false },
      },
      tuesday: {
        open: { type: String, default: "07:00" },
        close: { type: String, default: "22:00" },
        closed: { type: Boolean, default: false },
      },
      wednesday: {
        open: { type: String, default: "07:00" },
        close: { type: String, default: "22:00" },
        closed: { type: Boolean, default: false },
      },
      thursday: {
        open: { type: String, default: "07:00" },
        close: { type: String, default: "22:00" },
        closed: { type: Boolean, default: false },
      },
      friday: {
        open: { type: String, default: "07:00" },
        close: { type: String, default: "22:00" },
        closed: { type: Boolean, default: false },
      },
      saturday: {
        open: { type: String, default: "08:00" },
        close: { type: String, default: "21:00" },
        closed: { type: Boolean, default: false },
      },
      sunday: {
        open: { type: String, default: "08:00" },
        close: { type: String, default: "20:00" },
        closed: { type: Boolean, default: false },
      },
    },
    services: [String],
    amenities: [String],
    description: String,
    categories: {
      type: [String],
      default: ["Laundromat"],
    },
    photos: [String],
    videos: [String],
    logo: String,
    dataSource: {
      type: String,
      enum: ["manual", "website_scrape", "google_scrape"],
      default: "manual",
    },
    scrapedAt: Date,
    lastUpdated: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
BusinessSchema.index({ owner: 1 });
BusinessSchema.index({ businessName: "text", description: "text" });

export default mongoose.model<IBusiness>("Business", BusinessSchema);
