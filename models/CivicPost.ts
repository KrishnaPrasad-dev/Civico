import mongoose, { Schema, model, models, Document } from "mongoose";

export interface ICivicPost extends Document {
  title: string;
  body: string;
  departmentId: string;
  departmentName: string;
  category: "official_update" | "law_update" | "myth_buster";
  truthLabel: "real" | "fake" | "advisory";
  comments: {
    userId: string;
    userName: string;
    text: string;
    createdAt: Date;
  }[];
  createdAt: Date;
}

const CivicPostSchema = new Schema<ICivicPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200,
    },
    departmentId: {
      type: String,
      required: true,
      trim: true,
    },
    departmentName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["official_update", "law_update", "myth_buster"],
      default: "official_update",
    },
    truthLabel: {
      type: String,
      enum: ["real", "fake", "advisory"],
      default: "advisory",
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

const CivicPost = models.CivicPost || model<ICivicPost>("CivicPost", CivicPostSchema);

export default CivicPost;
