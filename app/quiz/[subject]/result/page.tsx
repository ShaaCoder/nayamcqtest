'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SimpleProgress as Progress } from '@/components/simple-progress';
import {
  CheckCircle2,
  XCircle,
  Home,
  RotateCcw,
  Trophy,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import { Header } from '@/components/ui/header';
import { Question } from '@/lib/types';

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const subject = decodeURIComponent(params.subject as string);
  const id = searchParams.get('id');

  const [result, setResult] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showDetails, setShowDetails] = useState(true);

  // 🔹 Fetch quiz result
  useEffect(() => {
    if (!id) {
      router.push('/');
      return;
    }

    const loadResult = async () => {
      try {
        const res = await fetch(`/api/quiz/result?id=${id}`);
        const data = await res.json();

        if (!res.ok) {
          router.push('/');
          return;
        }

        setResult(data);
      } catch (err) {
        console.error('Result fetch failed', err);
        router.push('/');
      }
    };

    loadResult();
  }, [id, router]);

  // 🔹 Fetch full questions (for option text)
  useEffect(() => {
    if (!subject || !result) return;

    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `/api/questions?subject=${encodeURIComponent(subject)}`
        );
        const data = await res.json();

        if (data.questions?.length) {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error('Failed to fetch questions for results:', err);
      }
    };

    fetchQuestions();
  }, [subject, result]);

  if (!result) return null;

  const optionLabels = ['A', 'B', 'C', 'D'];
  const optionKeys = ['option_a', 'option_b', 'option_c', 'option_d'] as const;

  // 🔐 MongoDB-safe question lookup
  const getOptionText = (questionId: string, index: number) => {
    const question = questions.find(
      (q: any) => q.id === questionId || q._id === questionId
    );
    if (!question || index < 0 || index > 3) return '';
    return question[optionKeys[index]] || '';
  };

  const getScoreColor = (p: number) =>
    p >= 80
      ? 'text-green-600'
      : p >= 60
      ? 'text-blue-600'
      : p >= 40
      ? 'text-yellow-600'
      : 'text-red-600';

  const getScoreBg = (p: number) =>
    p >= 80
      ? 'bg-green-100'
      : p >= 60
      ? 'bg-blue-100'
      : p >= 40
      ? 'bg-yellow-100'
      : 'bg-red-100';

  const getScoreMessage = (p: number) =>
    p >= 80
      ? 'Excellent Work! 🎉'
      : p >= 60
      ? 'Good Job! 👍'
      : p >= 40
      ? 'Keep Practicing! 📚'
      : 'Need More Practice 💪';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">

          {/* ---------- TOP RESULT CARD ---------- */}
          <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm mb-8">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg">
                  <Trophy className="h-12 w-12 text-white" />
                </div>
              </div>

              <CardTitle className="text-3xl font-bold">Quiz Completed!</CardTitle>
              <CardDescription className="text-lg">{subject}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="text-center">
                <div
                  className={`inline-block px-6 py-3 rounded-full text-4xl font-bold ${getScoreBg(
                    result.scorePercentage
                  )} ${getScoreColor(result.scorePercentage)}`}
                >
                  {result.scorePercentage}%
                </div>

                <p className="text-xl mt-2 font-medium">
                  {getScoreMessage(result.scorePercentage)}
                </p>
              </div>

              <Progress value={result.scorePercentage} className="h-3 my-6" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-slate-50">
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold">
                      {result.totalQuestions}
                    </div>
                    <p className="text-sm">Total Questions</p>
                  </CardContent>
                </Card>

                <Card className="bg-green-50">
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {result.correctAnswers}
                    </div>
                    <p className="text-sm text-green-700">Correct</p>
                  </CardContent>
                </Card>

                <Card className="bg-red-50">
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {result.wrongAnswers}
                    </div>
                    <p className="text-sm text-red-700">Wrong</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => router.push('/')} className="flex-1">
                  <Home className="h-4 w-4 mr-2" /> Home
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/quiz/${encodeURIComponent(subject)}`)
                  }
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" /> Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ---------- DETAILED RESULTS ---------- */}
          <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl flex items-center">
                <Eye className="h-5 w-5 mr-2" /> Detailed Results
              </CardTitle>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide' : 'Show'}
              </Button>
            </CardHeader>

            <CardContent>
              {showDetails && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {result.results.map((item: any, index: number) => {
                    const correctText = getOptionText(
                      item.questionId,
                      item.correctIndex
                    );
                    const selectedText =
                      item.selectedIndex >= 0
                        ? getOptionText(item.questionId, item.selectedIndex)
                        : '';

                    return (
                      <Card
                        key={item.questionId}
                        className={`${
                          item.isCorrect
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">
                              Question {index + 1}
                            </span>
                            <Badge variant="secondary">
                              {item.isCorrect ? 'Correct' : 'Incorrect'}
                            </Badge>
                          </div>
                          <CardTitle className="text-sm mt-2 line-clamp-2">
                            {item.question}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2 text-xs">
                          {!item.isCorrect && item.selectedIndex >= 0 && (
                            <div className="p-2 bg-red-100 rounded flex">
                              <XCircle className="h-3 w-3 mr-1 text-red-600" />
                              Your Answer:{' '}
                              <b>
                                {selectedText ||
                                  optionLabels[item.selectedIndex]}
                              </b>
                            </div>
                          )}

                          <div className="p-2 bg-green-100 rounded flex">
                            <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                            Correct:{' '}
                            <b>
                              {correctText ||
                                optionLabels[item.correctIndex]}
                            </b>
                          </div>

                          {item.selectedIndex === -1 && (
                            <div className="p-2 bg-yellow-100 rounded flex">
                              <AlertTriangle className="h-3 w-3 mr-1 text-yellow-600" />
                              Not Answered
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
