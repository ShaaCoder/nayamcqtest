/*
  # MCQ Exam Preparation System Schema

  1. New Tables
    - `admins`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password` (text, hashed password)
      - `created_at` (timestamptz)
    
    - `questions`
      - `id` (uuid, primary key)
      - `question_text` (text, the question content)
      - `option_a` (text, first option)
      - `option_b` (text, second option)
      - `option_c` (text, third option)
      - `option_d` (text, fourth option)
      - `correct_index` (integer, 0-3 indicating correct option)
      - `subject` (text, subject category)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `quiz_results`
      - `id` (uuid, primary key)
      - `subject` (text)
      - `total_questions` (integer)
      - `correct_answers` (integer)
      - `wrong_answers` (integer)
      - `score_percentage` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Admins table: Service role only access
    - Questions table: Public read, admin write
    - Quiz results table: Public insert, no read restrictions
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_index integer NOT NULL CHECK (correct_index >= 0 AND correct_index <= 3),
  subject text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  total_questions integer NOT NULL DEFAULT 0,
  correct_answers integer NOT NULL DEFAULT 0,
  wrong_answers integer NOT NULL DEFAULT 0,
  score_percentage numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Admins policies (service role only for security)
CREATE POLICY "Service role can manage admins"
  ON admins
  FOR ALL
  USING (auth.role() = 'service_role');

-- Questions policies (public read, will handle admin write in API)
CREATE POLICY "Anyone can read questions"
  ON questions
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can insert questions"
  ON questions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update questions"
  ON questions
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete questions"
  ON questions
  FOR DELETE
  TO service_role
  USING (true);

-- Quiz results policies (anyone can insert and read their results)
CREATE POLICY "Anyone can insert quiz results"
  ON quiz_results
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read quiz results"
  ON quiz_results
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON quiz_results(created_at DESC);

-- Insert default admin (username: admin, password: admin123)
-- Password is bcrypt hash of "admin123"
INSERT INTO admins (username, password)
VALUES ('admin', '$2a$10$rKYE0XZ4QvZ8bLBQ.zQqVeTK7.uZBvUqH6kZZ0K9xYvWZxN6oQvJi')
ON CONFLICT (username) DO NOTHING;