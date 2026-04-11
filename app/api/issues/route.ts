export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Issue from "@/models/Issue";
import { connectDB } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

/* -------------------- CLOUDINARY CONFIG -------------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/* -------------------- GET ISSUES -------------------- */
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

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
      images: issue.images ?? [],
      userId: issue.userId,
      userName: issue.userName,
      comments: (issue.comments ?? []).map((comment: any) => ({
        userId: comment.userId,
        userName: comment.userName,
        text: comment.text,
        createdAt: comment.createdAt,
      })),
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

/* -------------------- CREATE ISSUE (WITH CLOUDINARY IMAGES) -------------------- */
export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const location = formData.get("location")?.toString();
    const department = formData.get("department")?.toString();
    const userId = formData.get("userId")?.toString();
    const userName = formData.get("userName")?.toString();

    if (
      !title ||
      !description ||
      !location ||
      !department ||
      !userId ||
      !userName
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const files = formData.getAll("images") as File[];
    const imageUrls: string[] = [];

    if (files.length > 4) {
      return NextResponse.json(
        { message: "Maximum 4 images allowed" },
        { status: 400 }
      );
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "civico/issues" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      imageUrls.push(uploadResult.secure_url);
    }

    const issue = await Issue.create({
      title,
      description,
      location,
      department,
      userId,
      userName,
      images: imageUrls,
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
