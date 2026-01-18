import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { extractedText, subject } = await req.json();

    // ---------- VALIDATION ----------
    if (!extractedText || extractedText.trim().length < 20) {
      return NextResponse.json(
        { error: "Insufficient text for MCQ generation." },
        { status: 400 }
      );
    }

    if (!subject || subject.trim().length < 2) {
      return NextResponse.json(
        { error: "Subject is required." },
        { status: 400 }
      );
    }

    const normalizedSubject = subject.trim().toLowerCase();

    // ---------- AI CALL ----------
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
Generate exactly 5 multiple choice questions.

Text:
${extractedText}

Rules:
- Return STRICT JSON only
- No explanations
- No markdown
- No extra text

JSON format:
{
  "mcqs": [
    {
      "question_text": "",
      "option_a": "",
      "option_b": "",
      "option_c": "",
      "option_d": "",
      "correct_index": 0
    }
  ]
}
`,
    });

    const raw = response.output_text;

    if (!raw) throw new Error("Empty AI response");

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed.mcqs)) {
      throw new Error("Invalid MCQ format");
    }

    const mcqs = parsed.mcqs.map((q: any) => ({
      ...q,
      subject: normalizedSubject,
    }));

    return NextResponse.json({ mcqs });

  } catch (err) {
    console.error("MCQ GENERATION ERROR:", err);
    return NextResponse.json(
      { error: "Failed to generate MCQs." },
      { status: 500 }
    );
  }
}
