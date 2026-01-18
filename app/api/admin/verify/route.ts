export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";

export async function GET() {
  try {
    // ✅ Get adminId from JWT cookie
    const adminId = getAdminSession();

    if (!adminId) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    await connectDB();

    // ✅ Fetch admin from MongoDB
    const admin = await Admin.findById(adminId).select(
      "_id username created_at"
    );

    if (!admin) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      admin: {
        id: admin._id.toString(),
        username: admin.username,
        created_at: admin.created_at,
      },
    });
  } catch (error) {
    console.error("Verify error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
