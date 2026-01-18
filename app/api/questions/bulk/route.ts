export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Question } from "@/models/Question";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // 🔐 Admin auth (extra safety, middleware already protects)
    const adminId = getAdminSession();
    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { questions } = await req.json();

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "No questions provided" },
        { status: 400 }
      );
    }

    const formatted = questions.map((q: any) => ({
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_index:
        typeof q.correct_index === "number" ? q.correct_index : 0,
      subject: q.subject || "General",
    }));

    await Question.insertMany(formatted);

    return NextResponse.json({
      success: true,
      count: formatted.length,
    });
  } catch (err) {
    console.error("Bulk insert failed:", err);

    return NextResponse.json(
      { error: "Bulk insert failed" },
      { status: 500 }
    );
  }
}
