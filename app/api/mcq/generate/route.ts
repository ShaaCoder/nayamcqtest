import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { extractedText } = await req.json();

    if (!extractedText || extractedText.trim().length < 5) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an MCQ generator. ALWAYS return valid JSON ONLY."
        },
        {
          role: "user",
          content: `
Generate 5 MCQs from this text:

${extractedText}

Return ONLY JSON:
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
`
        }
      ],
    });

    const raw = completion.choices[0].message.content;
    const json = JSON.parse(raw!);

    return NextResponse.json({ mcqs: json.mcqs });
  } catch (err: any) {
    console.error("MCQ API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to generate MCQs" },
      { status: 500 }
    );
  }
}
