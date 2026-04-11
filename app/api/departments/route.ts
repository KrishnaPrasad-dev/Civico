export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const departments = await User.find({ role: "department" })
      .select("fullName email city state bio isVerified createdAt")
      .sort({ isVerified: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: departments });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}
