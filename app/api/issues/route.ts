export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Issue from "@/models/Issue";
import { connectDB } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");

    const issues = await Issue.find()
      .sort({ votes: -1, createdAt: -1 })
      .lean();

    const data = issues.map((issue: any) => ({
      _id: issue._id,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      createdAt: issue.createdAt,
      votes: issue.votes,
      hasVoted: userId
        ? issue.voters.some((v: any) => v.userId === userId)
        : false,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("❌ Error fetching issues:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch issues" },
      { status: 500 }
    );
  }
}
