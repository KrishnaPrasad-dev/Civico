export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Issue from "@/models/Issue";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const { userId, userName, text } = await req.json();

    const cleanText = typeof text === "string" ? text.trim() : "";

    if (!userId || !userName) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!cleanText) {
      return NextResponse.json(
        { message: "Comment cannot be empty" },
        { status: 400 }
      );
    }

    if (cleanText.length > 500) {
      return NextResponse.json(
        { message: "Comment is too long" },
        { status: 400 }
      );
    }

    const newComment = {
      userId,
      userName,
      text: cleanText,
      createdAt: new Date(),
    };

    // Use raw collection update so comment writes persist even if a stale
    // mongoose model instance is cached during hot-reload sessions.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid issue id" }, { status: 400 });
    }

    const result = await Issue.collection.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $push: { comments: newComment } } as any,
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ message: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        comment: {
          userId: newComment.userId,
          userName: newComment.userName,
          text: newComment.text,
          createdAt: newComment.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Comment API error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
