export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CivicPost from "@/models/CivicPost";

export async function GET() {
  try {
    await connectDB();

    const posts = await CivicPost.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: posts.map((post: any) => ({
        _id: post._id,
        title: post.title,
        body: post.body,
        departmentId: post.departmentId,
        departmentName: post.departmentName,
        category: post.category,
        truthLabel: post.truthLabel,
        createdAt: post.createdAt,
        comments: (post.comments ?? []).map((comment: any) => ({
          userId: comment.userId,
          userName: comment.userName,
          text: comment.text,
          createdAt: comment.createdAt,
        })),
      })),
    });
  } catch (error) {
    console.error("Error fetching civic posts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch civic posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { title, body, departmentId, departmentName, category, truthLabel, role } =
      await req.json();

    if (!title || !body || !departmentId || !departmentName) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (role !== "department" && role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only departments can post updates" },
        { status: 403 }
      );
    }

    const created = await CivicPost.create({
      title,
      body,
      departmentId,
      departmentName,
      category: category || "official_update",
      truthLabel: truthLabel || "advisory",
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating civic post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create civic post" },
      { status: 500 }
    );
  }
}
