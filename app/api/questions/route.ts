export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Question } from "@/models/Question";
import { getAdminSession } from "@/lib/auth";

/**
 * GET /api/questions?subject=xyz
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
  const subject = searchParams.get("subject");

const filter: Record<string, any> = {};
if (subject) {
  filter.subject = subject.trim().toLowerCase();
}


    const questions = await Question.find(filter).sort({
      createdAt: -1,
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Get questions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/questions
 */
export async function POST(request: NextRequest) {
  try {
    const adminId = getAdminSession();
    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const {
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_index,
      subject,
    } = await request.json();

    if (
      !question_text ||
      !option_a ||
      !option_b ||
      !option_c ||
      !option_d ||
      correct_index === undefined ||
      !subject
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (correct_index < 0 || correct_index > 3) {
      return NextResponse.json(
        { error: "Correct index must be between 0 and 3" },
        { status: 400 }
      );
    }

  const question = await Question.create({
  question_text,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_index,
  subject: subject.trim().toLowerCase(),
});


    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error("Create question error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
