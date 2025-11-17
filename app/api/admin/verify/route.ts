import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // ✅ correct file

export async function GET(request: NextRequest) {
  try {
    // 🔥 getAdminSession is async → MUST await
    const adminId = await getAdminSession();

    if (!adminId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // 🔥 Only service role can read admins table
    const { data: admin, error } = await supabaseAdmin
      .from("admins")
      .select("id, username, created_at")
      .eq("id", adminId)
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      admin,
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
