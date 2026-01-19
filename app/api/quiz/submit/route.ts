export const runtime = "nodejs";
<<<<<<< HEAD
=======
export const dynamic = "force-dynamic";
>>>>>>> 90a1623 (fix the api/categories put method seo excced)

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Question } from "@/models/Question";
import { QuizResult } from "@/models/QuizResult";

interface IncomingAnswer {
  questionId: string;
  selectedIndex: number;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const {
      answers,
      subject,
    }: { answers: IncomingAnswer[]; subject: string } =
      await request.json();

    if (!answers?.length || !subject) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    // 🔹 Fetch questions by MongoDB _id
    const ids = answers.map((a) => a.questionId);

    const questions = await Question.find({
      _id: { $in: ids },
    });

    if (!questions.length) {
      return NextResponse.json(
        { error: "Failed to fetch questions" },
        { status: 500 }
      );
    }

    let correct = 0;

    const results = answers
      .map((ans) => {
        const q = questions.find(
          (row: any) => row._id.toString() === ans.questionId
        );
        if (!q) return null;

        const ok = q.correct_index === ans.selectedIndex;
        if (ok) correct++;

        return {
          questionId: q._id.toString(),
          question: q.question_text,
          selectedIndex: ans.selectedIndex,
          correctIndex: q.correct_index,
          isCorrect: ok,
        };
      })
      .filter(Boolean);

    const wrong = answers.length - correct;
    const percentage = Math.round((correct / answers.length) * 100);

    // 🔹 Save quiz result
    const saved = await QuizResult.create({
      subject,
      total_questions: answers.length,
      correct_answers: correct,
      wrong_answers: wrong,
      score_percentage: percentage,
      results, // stored as array
    });

    return NextResponse.json({ id: saved._id.toString() });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
