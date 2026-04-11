import mongoose, { Schema, models, model } from "mongoose";

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
      enum: ["fire", "water", "ghmc", "electricity", "roads"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved"],
      default: "pending",
    },

    userId: {
      type: String,
      required: true,
    },

    // ✅ NEW: author name (THIS FIXES YOUR PROBLEM)
    userName: {
      type: String,
      required: true,
    },

    // 🖼️ Issue images
    images: {
      type: [String],
      default: [],
    },

    // 🔥 Voting system
    votes: {
      type: Number,
      default: 0,
    },

    voters: {
      type: [
        {
          userId: {
            type: String,
            required: true,
          },
          vote: {
            type: Number,
            enum: [1, -1],
            required: true,
          },
        },
      ],
      default: [],
    },

    comments: {
      type: [
        {
          userId: {
            type: String,
            required: true,
          },
          userName: {
            type: String,
            required: true,
          },
          text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default models.Issue || model("Issue", IssueSchema);
