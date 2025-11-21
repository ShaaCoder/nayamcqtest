import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
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
      correct_index: q.correct_index ?? 0,
      subject: q.subject ?? "General",
    }));

    const { error } = await supabaseAdmin
      .from("questions")
      .insert(formatted);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: formatted.length });
  } catch (err) {
    return NextResponse.json(
      { error: "Bulk insert failed" },
      { status: 500 }
    );
  }
}
