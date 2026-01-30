import mongoose, { Schema, models, model } from 'mongoose'

const IssueSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      enum: ['fire', 'water', 'ghmc', 'electricity', 'roads'],
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved'],
      default: 'pending',
    },

    userId: {
      type: String, // later you can switch to ObjectId
      required: true,
    },
  },
  { timestamps: true }
)

export default models.Issue || model('Issue', IssueSchema)
