import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Issue from "@/models/Issue";

const MONGO_URI = process.env.MONGO_URI!;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGO_URI);
}

export async function GET() {
  try {
    await connectDB();

    const issues = await Issue.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: issues,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch issues" },
      { status: 500 }
    );
  }
}
