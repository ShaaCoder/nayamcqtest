export const runtime = "nodejs";
<<<<<<< HEAD
=======
export const dynamic = "force-dynamic";
>>>>>>> 90a1623 (fix the api/categories put method seo excced)

import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";

export async function POST() {
  try {
    // ✅ Clear admin session cookie
    clearAdminSession();

    return NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
