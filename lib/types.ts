export interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_index: number;
  subject: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionInput {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_index: number;
  subject: string;
}

export interface QuizResult {
  id?: string;
  subject: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  score_percentage: number;
  created_at?: string;
}

export interface Admin {
  id: string;
  username: string;
  created_at: string;
}
