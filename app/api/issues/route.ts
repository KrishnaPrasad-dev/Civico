export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Issue from "@/models/Issue";
import { connectDB } from "@/lib/db";
import fs from "fs";
import path from "path";

/* -------------------- TYPES -------------------- */
type UploadedFile = Blob & {
  name: string;
  type: string;
};

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

    const data = issues.map((issue) => ({
  _id: issue._id,
  title: issue.title,
  description: issue.description,
  status: issue.status,
  location: issue.location,
  department: issue.department,
  createdAt: issue.createdAt,
  votes: issue.votes,
  images: issue.images ?? [],
  userId: issue.userId,        // ✅ REQUIRED
  userName: issue.userName,    // ✅ THIS WAS MISSING
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

/* -------------------- CREATE ISSUE (WITH IMAGES) -------------------- */
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
        {
          message: "All fields are required",
          received: {
            title,
            description,
            location,
            department,
            userId,
            userName,
          },
        },
        { status: 400 }
      );
    }

    const files = formData.getAll("images") as UploadedFile[];
    const imageUrls: string[] = [];

    if (files.length > 4) {
      return NextResponse.json(
        { message: "Maximum 4 images allowed" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public/uploads/issues");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const buffer = Buffer.from(await file.arrayBuffer());

      const ext = file.name.split(".").pop() || "png";
      const filename = `issue_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      fs.writeFileSync(path.join(uploadDir, filename), buffer);

      imageUrls.push(`/uploads/issues/${filename}`);
    }

    const issue = await Issue.create({
      title,
      description,
      location,
      department,
      userId,
      userName, // 👈 SAVED HERE
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
