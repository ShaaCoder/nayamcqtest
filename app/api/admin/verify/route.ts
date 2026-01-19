export const runtime = "nodejs";
<<<<<<< HEAD
=======
export const dynamic = "force-dynamic";
>>>>>>> 90a1623 (fix the api/categories put method seo excced)

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";

export async function GET() {
  try {
<<<<<<< HEAD
    // ✅ Get adminId from JWT cookie
=======
>>>>>>> 90a1623 (fix the api/categories put method seo excced)
    const adminId = getAdminSession();

    if (!adminId) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    await connectDB();

<<<<<<< HEAD
    // ✅ Fetch admin from MongoDB
=======
>>>>>>> 90a1623 (fix the api/categories put method seo excced)
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
<<<<<<< HEAD

=======
>>>>>>> 90a1623 (fix the api/categories put method seo excced)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
