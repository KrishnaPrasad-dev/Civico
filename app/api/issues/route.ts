export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Issue from "@/models/Issue";
import { connectDB } from "@/lib/db";

/* -------------------- GET ISSUES -------------------- */
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // ✅ If userId exists → fetch only that user's issues
    // ✅ Else → fetch all issues (public feed)
    const filter = userId ? { userId } : {};

    const issues = await Issue.find(filter)
      .sort({ votes: -1, createdAt: -1 })
      .lean();

    const data = issues.map((issue: any) => ({
      _id: issue._id,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      location: issue.location,
      department: issue.department,
      createdAt: issue.createdAt,
      votes: issue.votes,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("❌ Error fetching issues:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch issues" },
      { status: 500 }
    );
  }
}

/* -------------------- CREATE ISSUE -------------------- */
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, description, location, department, userId } = body;

    if (!title || !description || !location || !department || !userId) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const issue = await Issue.create({
      title,
      description,
      location,
      department,
      userId,
    });

    return NextResponse.json(
      { success: true, data: issue },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating issue:", error);
    return NextResponse.json(
      { message: "Failed to create issue" },
      { status: 500 }
    );
  }
}
