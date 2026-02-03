import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Issue from "@/models/Issue";

/* -------------------- DB CONNECTION -------------------- */

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in environment variables");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/* -------------------- GET ALL ISSUES -------------------- */

export async function GET() {
  try {
    await connectDB();

    const issues = await Issue.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: issues,
    });
  } catch (error) {
    console.error("❌ Error fetching issues:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch issues" },
      { status: 500 }
    );
  }
}
