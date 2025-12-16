// app/api/signup/route.ts
export const runtime = "nodejs"; // ensure Node runtime (not edge)

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // <-- server-only client

export async function POST(request: Request) {
  try {
    // DEBUG: verify service role key is available on server (remove after testing)
    console.log(
      "SERVICE ROLE LOADED:",
      !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      "prefix:",
      process.env.SUPABASE_SERVICE_ROLE_KEY?.slice?.(0, 6)
    );

    const body = await request.json();
    const { username, password } = body ?? {};

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if username already exists using server client
    const { data: existingAdmin, error: selectError } = await supabaseAdmin
      .from("admins")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (selectError) {
      console.error("Select error:", selectError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (existingAdmin) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new admin via service-role client (bypasses RLS)
    const { data, error: insertError } = await supabaseAdmin
      .from("admins")
      .insert([{ username, password: hashedPassword }])
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: insertError.message || "Insert failed" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Admin created successfully", admin: { id: data.id, username: data.username } },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
