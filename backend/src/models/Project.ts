import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  client: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  business: mongoose.Types.ObjectId;
  package: mongoose.Types.ObjectId;
  
  // Project Details
  projectNumber: string;
  
  // Team Assignment
  assignedTo: mongoose.Types.ObjectId[];
  assignedAt?: Date;
  
  // Project Status Flow: NEW → IN_PROGRESS → COMPLETED
  status: "new" | "in_progress" | "completed" | "cancelled";
  
  // Timeline
  startedAt?: Date;
  expectedCompletionDate?: Date;
  completedAt?: Date;
  
  // Google Business Profile
  googleProfileUrl?: string;
  googleProfileStatus: "not_created" | "pending" | "live" | "suspended";
  googleProfileCreatedAt?: Date;
  
  // Client Uploads
  clientPhotos: string[];
  clientVideos: string[];
  clientNotes?: string;
  
  // Deliverables
  deliverables: {
    title: string;
    description?: string;
    fileUrl?: string;
    uploadedAt?: Date;
    uploadedBy?: mongoose.Types.ObjectId;
  }[];
  
  // Communication
  messages: {
    sender: mongoose.Types.ObjectId;
    senderRole: "client" | "admin";
    message: string;
    attachments?: string[];
    isRead: boolean;
    createdAt: Date;
  }[];
  
  // Status History
  statusHistory: {
    status: string;
    updatedBy: mongoose.Types.ObjectId;
    updatedByRole: "client" | "admin" | "system";
    note?: string;
    createdAt: Date;
  }[];
  
  // Management Period
  managementStartDate?: Date;
  managementEndDate?: Date;
  
  // Internal Notes (Admin only)
  internalNotes?: string;
  
  // Cancellation
  cancelledAt?: Date;
  cancellationReason?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
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
    projectNumber: {
      type: String,
      required: true,
      unique: true,
    },
    assignedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    assignedAt: Date,
    status: {
      type: String,
      enum: ["new", "in_progress", "completed", "cancelled"],
      default: "new",
    },
    startedAt: Date,
    expectedCompletionDate: Date,
    completedAt: Date,
    googleProfileUrl: String,
    googleProfileStatus: {
      type: String,
      enum: ["not_created", "pending", "live", "suspended"],
      default: "not_created",
    },
    googleProfileCreatedAt: Date,
    clientPhotos: [String],
    clientVideos: [String],
    clientNotes: String,
    deliverables: [
      {
        title: { type: String, required: true },
        description: String,
        fileUrl: String,
        uploadedAt: Date,
        uploadedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    messages: [
      {
        sender: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        senderRole: {
          type: String,
          enum: ["client", "admin"],
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        attachments: [String],
        isRead: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        updatedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        updatedByRole: {
          type: String,
          enum: ["client", "admin", "system"],
          required: true,
        },
        note: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    managementStartDate: Date,
    managementEndDate: Date,
    internalNotes: String,
    cancelledAt: Date,
    cancellationReason: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
ProjectSchema.index({ client: 1, status: 1, createdAt: -1 });
ProjectSchema.index({ assignedTo: 1, status: 1 });
ProjectSchema.index({ projectNumber: 1 });
ProjectSchema.index({ status: 1, createdAt: -1 });

// Auto-generate project number
ProjectSchema.pre("save", async function (next) {
  if (!this.projectNumber) {
    const count = await mongoose.model("Project").countDocuments();
    this.projectNumber = `GBP-${Date.now()}-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

export default mongoose.model<IProject>("Project", ProjectSchema);
