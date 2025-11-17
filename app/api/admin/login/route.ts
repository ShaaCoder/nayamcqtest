// /app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { setAdminSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Admin table is protected → use service role
    const { data: admin, error } = await supabaseAdmin
      .from("admins")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    await setAdminSession(admin.id);

    return NextResponse.json({
      message: "Login successful",
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
