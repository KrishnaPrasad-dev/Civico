export const runtime = "nodejs";

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import CivicPost from "@/models/CivicPost";

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
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!cleanText) {
      return NextResponse.json(
        { success: false, message: "Comment cannot be empty" },
        { status: 400 }
      );
    }

    if (cleanText.length > 500) {
      return NextResponse.json(
        { success: false, message: "Comment too long" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid post id" },
        { status: 400 }
      );
    }

    const comment = {
      userId,
      userName,
      text: cleanText,
      createdAt: new Date(),
    };

    const result = await CivicPost.collection.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $push: { comments: comment } } as any,
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error) {
    console.error("Civic post comment error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add comment" },
      { status: 500 }
    );
  }
}
