export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Issue from "@/models/Issue";
import { connectDB } from "@/lib/db";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    const issue = await Issue.findById(id);

    if (!issue) {
      return NextResponse.json(
        { message: "Issue not found" },
        { status: 404 }
      );
    }

    // ❌ Block multiple votes
    const alreadyVoted = issue.voters.some(
      (v: any) => v.userId === userId
    );

    if (alreadyVoted) {
      return NextResponse.json(
        { votes: issue.votes },
        { status: 200 }
      );
    }

    // ✅ Upvote once
    issue.votes += 1;
    issue.voters.push({ userId, vote: 1 });

    await issue.save();

    return NextResponse.json({ votes: issue.votes });
  } catch (error) {
    console.error("Vote API error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
