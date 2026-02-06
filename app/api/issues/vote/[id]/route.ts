export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Issue from "@/models/Issue";
import { connectDB } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id"); // optional

    const issues = await Issue.find().lean();

    const data = issues.map((issue: any) => ({
      ...issue,
      hasVoted: userId
        ? issue.voters.some((v: any) => v.userId === userId)
        : false,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
