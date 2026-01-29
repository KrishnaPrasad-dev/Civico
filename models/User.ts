import mongoose, { Schema, model, models, Document } from 'mongoose'

export interface IUser extends Document {
  fullName: string
  email: string
  password: string
  role: 'citizen' | 'department' | 'admin'
  reputationScore: number
  isVerified: boolean

  // Civic profile fields (optional)
  address?: string
  bio?: string
  phone?: string
  age?: number
  city?: string
  state?: string
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
      enum: ['citizen', 'department', 'admin'],
      default: 'citizen',
    },
    reputationScore: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Civic profile fields
    address: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// 🔒 Prevent model overwrite in Next.js hot reload
const User = models.User || model<IUser>('User', UserSchema)

export default User
