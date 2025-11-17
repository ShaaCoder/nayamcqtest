import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const { data: existingAdmin } = await supabase
      .from("admins")
      .select("*")
      .eq("username", username)
      .single();

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new admin
    const { data, error } = await supabase
      .from("admins")
      .insert([
        {
          username,
          password: hashedPassword,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Admin created successfully",
      admin: {
        id: data.id,
        username: data.username,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
