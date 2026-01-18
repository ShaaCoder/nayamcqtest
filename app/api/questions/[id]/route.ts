export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Question } from "@/models/Question";
import { getAdminSession } from "@/lib/auth";

/**
 * PUT /api/questions/:id
 * Update a question (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 🔐 Admin auth
    const adminId = getAdminSession();
    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const {
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_index,
      subject,
    } = body;

    // ✅ Same validations as Supabase version
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

    const question = await Question.findByIdAndUpdate(
      params.id,
      {
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_index,
        subject,
        updated_at: new Date(),
      },
      { new: true }
    );

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // ✅ Same response shape
    return NextResponse.json({ question });
  } catch (error) {
    console.error("Update question error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/questions/:id
 * Delete a question (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 🔐 Admin auth
    const adminId = getAdminSession();
    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const deleted = await Question.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Delete question error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
