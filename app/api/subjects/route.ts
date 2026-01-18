import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Question } from "@/models/Question";

export const dynamic = "force-dynamic"; // 🔴 VERY IMPORTANT
export const revalidate = 0;            // 🔴 NO CACHE

export async function GET() {
  try {
    await connectDB();

    // ✅ Fetch unique subjects directly from MongoDB
    const subjects = await Question.distinct("subject");

    // Clean + normalize (same as Supabase logic)
    const cleaned = subjects
      .map((s) => s?.trim())
      .filter(Boolean);

    return NextResponse.json({ subjects: cleaned });
  } catch (error) {
    console.error("Fetch subjects error:", error);
    return NextResponse.json({ subjects: [] });
  }
}
