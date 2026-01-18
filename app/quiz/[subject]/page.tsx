'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { SimpleProgress as Progress } from '@/components/simple-progress';
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Question } from '@/lib/types';
import { Header } from '@/components/ui/header';

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const subject = decodeURIComponent(params.subject as string);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
const normalizedSubject = subject.trim().toLowerCase();

  useEffect(() => {
    fetchQuestions();
  }, [subject]);

  const fetchQuestions = async () => {
    try {
    const response = await fetch(
  `/api/questions?subject=${encodeURIComponent(normalizedSubject)}`
);

      const data = await response.json();

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        alert('No questions found for this subject');
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      alert('Failed to load questions');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  // ✅ IMPORTANT: MongoDB-safe question id
  const questionId =
    (currentQuestion as any)?.id || (currentQuestion as any)?._id;

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const selectedAnswer = answers.get(questionId);
  const isComplete = answers.size === questions.length;

  const handleAnswerSelect = (optionIndex: number) => {
    if (!questionId) return;

    const newAnswers = new Map(answers);
    newAnswers.set(questionId, optionIndex);
    setAnswers(newAnswers);

    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 300);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async (isEarlyEnd = false) => {
    const incompleteCount = questions.length - answers.size;
    let confirmed = true;

    if (incompleteCount > 0) {
      const message = isEarlyEnd
        ? `You have ${incompleteCount} unanswered questions. End test anyway?`
        : `You answered ${answers.size} out of ${questions.length}. Submit anyway?`;

      confirmed = confirm(message);
      if (!confirmed) return;
    }

    if (isEarlyEnd) setShowEndModal(false);

    setSubmitting(true);

    try {
      // ✅ MongoDB-safe submit payload
      const answersArray = questions.map((q) => {
        const qId = (q as any).id || (q as any)._id;
        return {
          questionId: qId,
          selectedIndex: answers.get(qId) ?? -1,
        };
      });

      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersArray, subject }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submit failed');
      }

      router.push(
        `/quiz/${encodeURIComponent(subject)}/result?id=${data.id}`
      );
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEndTest = () => {
    setShowEndModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (!currentQuestion) return null;

  const options = [
    { label: 'A', value: currentQuestion.option_a, index: 0 },
    { label: 'B', value: currentQuestion.option_b, index: 1 },
    { label: 'C', value: currentQuestion.option_c, index: 2 },
    { label: 'D', value: currentQuestion.option_d, index: 3 },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* ---------- HEADER ---------- */}
        <header className="bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Button variant="ghost" onClick={() => router.push('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div className="text-center">
              <h1 className="text-lg font-bold">{subject}</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleEndTest}>
              <XCircle className="h-4 w-4 mr-1" /> End
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </header>

        {/* ---------- QUESTION CARD ---------- */}
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">
                {currentQuestion.question_text}
              </CardTitle>
              <CardDescription>Select the correct answer</CardDescription>
            </CardHeader>

            <CardContent>
              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(v) => handleAnswerSelect(parseInt(v))}
                className="space-y-3"
              >
                {options.map((opt) => (
                  <div
                    key={opt.index}
                    className={`p-3 border rounded-lg cursor-pointer ${
                      selectedAnswer === opt.index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200'
                    }`}
                    onClick={() => handleAnswerSelect(opt.index)}
                  >
                    <RadioGroupItem
                      value={opt.index.toString()}
                      id={`opt-${opt.index}`}
                    />
                    <Label
                      htmlFor={`opt-${opt.index}`}
                      className="ml-3 cursor-pointer"
                    >
                      <strong>{opt.label}.</strong> {opt.value}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  Previous
                </Button>

                {currentIndex < questions.length - 1 ? (
                  <Button onClick={handleNext}>
                    Next <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSubmit(false)}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting
                      </>
                    ) : (
                      'Finish Quiz'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </main>

        {/* ---------- END TEST MODAL ---------- */}
        {showEndModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-red-500" />
                <h3 className="font-semibold">End Test?</h3>
              </div>
              <p className="mb-4">
                You still have unanswered questions. Submit anyway?
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEndModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleSubmit(true)}
                >
                  End Test
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
