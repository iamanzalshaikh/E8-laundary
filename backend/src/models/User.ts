import mongoose, { type Document, type Model } from "mongoose";
import bcryptjs from "bcryptjs";

// ============================================
// INTERFACES
// ============================================

export interface IUser extends Document {
  email: string;
  password: string;
  role: "client" | "admin";
  businessName?: string;
  phone?: string;
  isEmailVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {
  // Static methods can be added here if needed
}

// ============================================
// SCHEMA
// ============================================

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },
    businessName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        "Please provide a valid phone number",
      ],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: Record<string, unknown>) {
        const { password, __v, ...rest } = ret;
        return rest;
      },
    },
  }
);

// ============================================
// INDEXES
// ============================================

// Note: email index is already created by unique: true constraint
userSchema.index({ createdAt: -1 });

// ============================================
// MIDDLEWARE - Hash password before saving
// ============================================

userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// ============================================
// METHODS
// ============================================

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcryptjs.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// ============================================
// MODEL
// ============================================

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
