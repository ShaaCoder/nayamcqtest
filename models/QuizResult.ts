import mongoose, { Schema, Document, Model } from "mongoose";

export interface QuizResultItem {
  questionId: string;
  question: string;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
}

export interface QuizResultDocument extends Document {
  subject: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  score_percentage: number;
  results: QuizResultItem[]; // ✅ IMPORTANT
  created_at: Date;
}

const QuizResultSchema = new Schema<QuizResultDocument>(
  {
    subject: { type: String, required: true },
    total_questions: { type: Number, required: true },
    correct_answers: { type: Number, required: true },
    wrong_answers: { type: Number, required: true },
    score_percentage: { type: Number, required: true },

    // ✅ THIS WAS MISSING IN TYPES
    results: {
      type: [
        {
          questionId: String,
          question: String,
          selectedIndex: Number,
          correctIndex: Number,
          isCorrect: Boolean,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: false,
    },
  }
);

export const QuizResult: Model<QuizResultDocument> =
  mongoose.models.QuizResult ||
  mongoose.model<QuizResultDocument>("QuizResult", QuizResultSchema);
