export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { QuizResult } from "@/models/QuizResult";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    // 🔐 Validate Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid id" },
        { status: 400 }
      );
    }

    const data = await QuizResult.findById(id).lean();

    if (!data) {
      return NextResponse.json(
        { error: "Result not found" },
        { status: 404 }
      );
    }

    // ✅ SAME response shape as Supabase version
    return NextResponse.json({
      totalQuestions: data.total_questions,
      correctAnswers: data.correct_answers,
      wrongAnswers: data.wrong_answers,
      scorePercentage: data.score_percentage,
      results: data.results || [],
    });
  } catch (error) {
    console.error("Quiz result fetch error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
