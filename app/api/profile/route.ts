import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserIdFromRequest } from "@/lib/auth";

/**
 * GET /api/profile
 * Get logged-in user's profile
 */
export async function GET(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const user = await User.findById(userId).select(
      "fullName address bio phone age city state role isVerified"
    );

    if (!user) {
      return NextResponse.json({}, { status: 200 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/profile
 * Update logged-in user's profile
 */
export async function PUT(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fullName, address, bio, phone, age, city, state } = body;

    await connectDB();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          fullName,
          address,
          bio,
          phone,
          age,
          city,
          state,
        },
      },
      { new: true }
    ).select("fullName address bio phone age city state");

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
