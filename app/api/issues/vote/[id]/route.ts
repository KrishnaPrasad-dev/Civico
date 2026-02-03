export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Issue from "@/models/Issue";
import { connectDB } from "@/lib/db";

type Voter = {
  userId: string;
  vote: 1 | -1;
};

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 IMPORTANT
) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ UNWRAP PARAMS

    const body = await req.json();
    const userId: string = body.userId;
    const vote: 1 | -1 = body.vote;

    if (!userId || ![1, -1].includes(vote)) {
      return NextResponse.json(
        { message: "Invalid request" },
        { status: 400 }
      );
    }

    const issue = await Issue.findById(id);

    if (!issue) {
      return NextResponse.json(
        { message: "Issue not found" },
        { status: 404 }
      );
    }

    const existingVote = issue.voters.find(
      (v: Voter) => v.userId === userId
    );

    if (!existingVote) {
      issue.voters.push({ userId, vote });
      issue.votes += vote;
    } else if (existingVote.vote !== vote) {
      issue.votes += vote * 2;
      existingVote.vote = vote;
    } else {
      return NextResponse.json({ votes: issue.votes });
    }

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
