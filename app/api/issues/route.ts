export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Issue from "@/models/Issue";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    const issues = await Issue.find()
      .sort({ votes: -1, createdAt: -1 })
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
