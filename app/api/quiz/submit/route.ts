// /app/api/quiz/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

interface IncomingAnswer {
  questionId: string;
  selectedIndex: number;
}

interface QuestionRow {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_index: number;
}

export async function POST(request: NextRequest) {
  try {
    const { answers, subject }: { answers: IncomingAnswer[]; subject: string } =
      await request.json();

    if (!answers?.length || !subject) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const ids = answers.map((a: IncomingAnswer) => a.questionId);

    const { data: questions, error } = await supabase
      .from("questions")
      .select("*")
      .in("id", ids);

    if (error || !questions) {
      return NextResponse.json(
        { error: "Failed to fetch questions" },
        { status: 500 }
      );
    }

    let correct = 0;

    const results = answers
      .map((ans: IncomingAnswer) => {
        const q = (questions as QuestionRow[]).find(
          (row) => row.id === ans.questionId
        );
        if (!q) return null;

        const ok = q.correct_index === ans.selectedIndex;
        if (ok) correct++;

        return {
          questionId: q.id,
          question: q.question_text,
          selectedIndex: ans.selectedIndex,
          correctIndex: q.correct_index,
          isCorrect: ok,
        };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));

    const wrong = answers.length - correct;
    const percentage = (correct / answers.length) * 100;

    const { data: inserted, error: saveErr } = await supabaseAdmin
      .from("quiz_results")
      .insert({
        subject,
        total_questions: answers.length,
        correct_answers: correct,
        wrong_answers: wrong,
        score_percentage: percentage,
        results_json: results,
      })
      .select("id")
      .single();

    if (saveErr) {
      return NextResponse.json({ error: "Save failed" }, { status: 500 });
    }

    return NextResponse.json({ id: inserted.id });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
