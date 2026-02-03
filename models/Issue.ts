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

    // 🔥 NEW: voting system
    votes: {
      type: Number,
      default: 0,
    },

    voters: [
      {
        userId: {
          type: String, // same as userId above
          required: true,
        },
        vote: {
          type: Number, // 1 = upvote, -1 = downvote
          enum: [1, -1],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
)

export default models.Issue || model('Issue', IssueSchema)
