// /app/api/admin/upload-questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { rows } = await req.json();

    if (!rows?.length) {
      return NextResponse.json(
        { error: "No data received" },
        { status: 400 }
      );
    }

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

    // CLEAN DATA
    const cleaned: CleanQ[] = (rows as RawQ[])
      .map((r) => ({
        question_text: r.question_text?.trim() || "",
        option_a: r.option_a?.trim() || "",
        option_b: r.option_b?.trim() || "",
        option_c: r.option_c?.trim() || "",
        option_d: r.option_d?.trim() || "",
        subject: r.subject?.trim() || "",
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
          !isNaN(q.correct_index) &&
          q.correct_index >= 0 &&
          q.correct_index <= 3
      );

    if (!cleaned.length) {
      return NextResponse.json(
        { error: "All rows are invalid or empty" },
        { status: 400 }
      );
    }

    // REMOVE DUPLICATES IN SAME FILE
    const map = new Map<string, CleanQ>();
    cleaned.forEach((q) => {
      map.set(q.question_text.toLowerCase(), q);
    });
    const unique = Array.from(map.values());

    // REMOVE QUESTIONS ALREADY IN DATABASE
    const { data: existing } = await supabaseAdmin
      .from("questions")
      .select("question_text");

    const existingSet = new Set(
      existing?.map((q) => q.question_text.toLowerCase())
    );

    const finalInsert = unique.filter(
      (q) => !existingSet.has(q.question_text.toLowerCase())
    );

    if (!finalInsert.length) {
      return NextResponse.json(
        { error: "All questions already exist" },
        { status: 409 }
      );
    }

    // INSERT TO SUPABASE
    const { error } = await supabaseAdmin
      .from("questions")
      .insert(finalInsert);

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      received: rows.length,
      cleaned: cleaned.length,
      unique: unique.length,
      inserted: finalInsert.length,
      duplicates_in_file: cleaned.length - unique.length,
      duplicates_in_db: unique.length - finalInsert.length,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
