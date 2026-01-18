export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Question } from "@/models/Question";
import { getAdminSession } from "@/lib/auth";

/* ================= TYPES ================= */

interface RawQ {
  question_text?: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_index?: string | number;
  subject?: string;
}

interface CleanQ {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_index: number;
  subject: string;
}

/* ================= API ================= */

export async function POST(req: NextRequest) {
  try {
    /* 🔐 ADMIN AUTH */
    const adminId = getAdminSession();
    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { rows } = await req.json();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: "No data received" },
        { status: 400 }
      );
    }

    /* ================= CLEAN & VALIDATE ================= */

    const cleaned: CleanQ[] = (rows as RawQ[])
      .map((r) => ({
        question_text: r.question_text?.trim() || "",
        option_a: r.option_a?.trim() || "",
        option_b: r.option_b?.trim() || "",
        option_c: r.option_c?.trim() || "",
        option_d: r.option_d?.trim() || "",
        subject: r.subject?.trim().toLowerCase() || "",
        correct_index: Number(r.correct_index),
      }))
      .filter(
        (q) =>
          q.question_text &&
          q.option_a &&
          q.option_b &&
          q.option_c &&
          q.option_d &&
          q.subject &&
          Number.isInteger(q.correct_index) &&
          q.correct_index >= 0 &&
          q.correct_index <= 3
      );

    if (!cleaned.length) {
      return NextResponse.json(
        { error: "All rows are invalid or empty" },
        { status: 400 }
      );
    }

    /* ================= REMOVE DUPLICATES (FILE) ================= */

    const fileMap = new Map<string, CleanQ>();
    cleaned.forEach((q) => {
      fileMap.set(q.question_text.toLowerCase(), q);
    });
    const uniqueInFile = Array.from(fileMap.values());

    /* ================= REMOVE DUPLICATES (DB) ================= */

    const existing = await Question.find(
      {
        question_text: {
          $in: uniqueInFile.map((q) => q.question_text),
        },
      },
      { question_text: 1 }
    ).lean();

    const existingSet = new Set(
      existing.map((q) => q.question_text.toLowerCase())
    );

    const finalInsert = uniqueInFile.filter(
      (q) => !existingSet.has(q.question_text.toLowerCase())
    );

    if (!finalInsert.length) {
      return NextResponse.json(
        { error: "All questions already exist in database" },
        { status: 409 }
      );
    }

    /* ================= INSERT ================= */

    await Question.insertMany(finalInsert);

    /* ================= RESPONSE ================= */

    return NextResponse.json({
      success: true,
      received: rows.length,
      cleaned: cleaned.length,
      unique_in_file: uniqueInFile.length,
      inserted: finalInsert.length,
      duplicates_in_file: cleaned.length - uniqueInFile.length,
      duplicates_in_db: uniqueInFile.length - finalInsert.length,
    });
  } catch (err: any) {
    console.error("Upload questions error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
