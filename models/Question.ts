import mongoose, { Schema, Document, Model } from "mongoose";

export interface QuestionDocument extends Document {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_index: number;
  subject: string;
  created_at: Date;
  updated_at: Date;
}

const QuestionSchema = new Schema<QuestionDocument>(
  {
    question_text: {
      type: String,
      required: true,
      trim: true,
    },
    option_a: {
      type: String,
      required: true,
    },
    option_b: {
      type: String,
      required: true,
    },
    option_c: {
      type: String,
      required: true,
    },
    option_d: {
      type: String,
      required: true,
    },
    correct_index: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    subject: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export const Question: Model<QuestionDocument> =
  mongoose.models.Question || mongoose.model<QuestionDocument>("Question", QuestionSchema);
