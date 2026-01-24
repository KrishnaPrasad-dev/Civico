import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  role: "citizen" | "department" | "admin";
  reputationScore: number;
  isVerified: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["citizen", "department", "admin"],
      default: "citizen",
    },
    reputationScore: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in Next.js hot reload
const User = models.User || model<IUser>("User", UserSchema);

export default User;
