'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SimpleProgress as Progress } from '@/components/simple-progress';
import { CheckCircle2, XCircle, Home, RotateCcw, Trophy, AlertTriangle, Eye } from 'lucide-react';
import { Header } from '@/components/ui/header';
import { Question } from '@/lib/types'; // Import Question type

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const subject = decodeURIComponent(params.subject as string);

  const id = searchParams.get("id");
  const [result, setResult] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]); // New: Fetch full questions for options
  const [showDetails, setShowDetails] = useState(true);
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
      console.error("Result fetch failed", err);
      router.push('/');
    }
  };

  loadResult();
}, [id, router]);


  // New: Fetch full questions to get option texts
  useEffect(() => {
    if (!subject || !result) return;

    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/questions?subject=${encodeURIComponent(subject)}`);
        const data = await response.json();
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        }
      } catch (error) {
        console.error('Failed to fetch questions for results:', error);
      }
    };

    fetchQuestions();
  }, [subject, result]);

  if (!result) return null;

  const optionLabels = ['A', 'B', 'C', 'D'];
  const optionKeys = ['option_a', 'option_b', 'option_c', 'option_d'] as const;

  const getScoreColor = (p: number) =>
    p >= 80 ? 'text-green-600' :
    p >= 60 ? 'text-blue-600' :
    p >= 40 ? 'text-yellow-600' :
    'text-red-600';

  const getScoreBg = (p: number) =>
    p >= 80 ? 'bg-green-100' :
    p >= 60 ? 'bg-blue-100' :
    p >= 40 ? 'bg-yellow-100' :
    'bg-red-100';

  const getScoreMessage = (p: number) =>
    p >= 80 ? 'Excellent Work! 🎉' :
    p >= 60 ? 'Good Job! 👍' :
    p >= 40 ? 'Keep Practicing! 📚' :
    'Need More Practice 💪';

  // Helper: Get full option text by index
  const getOptionText = (questionId: string, index: number) => {
    const question = questions.find(q => q.id === questionId);
    if (!question || index < 0 || index > 3) return '';
    return question[optionKeys[index]] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto w-full"> {/* Updated: Wider max-width for better grid utilization */}

          {/* Enhanced Top Result Card: Animated score reveal */}
          <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm mb-8 overflow-hidden w-full">
            <CardHeader className="text-center relative z-10">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg animate-pulse">
                  <Trophy className="h-12 w-12 text-white drop-shadow-md" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-slate-800 mb-2">Quiz Completed!</CardTitle>
              <CardDescription className="text-lg text-slate-600">{subject}</CardDescription>
            </CardHeader>

            <CardContent className="relative z-10">
              <div className="text-center">
                <div className={`inline-block px-6 py-3 rounded-full ${getScoreBg(result.scorePercentage)} text-4xl font-bold ${getScoreColor(result.scorePercentage)} animate-fade-in w-full max-w-sm mx-auto`}>
                  {result.scorePercentage}%
                </div>
                <p className="text-xl text-slate-700 mt-2 font-medium">
                  {getScoreMessage(result.scorePercentage)}
                </p>
              </div>

              <Progress 
                value={result.scorePercentage} 
                className="h-3 my-6 bg-slate-200 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-600 rounded-full w-full" 
              />

              {/* Responsive Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 w-full">
                <Card className="border-0 bg-slate-50/50 w-full">
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-slate-800">{result.totalQuestions}</div>
                    <p className="text-sm text-slate-600 mt-1 flex items-center justify-center">
                      <Home className="h-4 w-4 mr-1" /> Total Questions
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-green-50/50 shadow-md w-full">
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {result.correctAnswers}
                    </div>
                    <p className="text-sm text-green-700 mt-1 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Correct
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-red-50/50 shadow-md w-full">
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {result.wrongAnswers}
                    </div>
                    <p className="text-sm text-red-700 mt-1 flex items-center justify-center">
                      <XCircle className="h-4 w-4 mr-1" /> Wrong
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 w-full">
                <Button 
                  onClick={() => router.push('/')} 
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 flex-1 max-w-md"
                >
                  <Home className="h-4 w-4 mr-2" /> Home
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push(`/quiz/${encodeURIComponent(subject)}`)}
                  className="w-full sm:w-auto border-slate-300 hover:bg-slate-50 flex-1 max-w-md"
                >
                  <RotateCcw className="h-4 w-4 mr-2" /> Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Updated Detailed Results: Grid Layout with adjusted widths */}
          <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center">
                <Eye className="h-5 w-5 mr-2" /> Detailed Results
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="text-slate-600 hover:text-slate-900"
              >
                {showDetails ? 'Hide' : 'Show'} Details
              </Button>
            </CardHeader>

            <CardContent className="w-full">
              {showDetails && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full"> {/* Updated: More columns on xl for wider layout */}
                  {result.results.map((item: any, index: number) => {
                    const correctOptionText = getOptionText(item.questionId, item.correctIndex);
                    const selectedOptionText = item.selectedIndex >= 0 ? getOptionText(item.questionId, item.selectedIndex) : '';

                    return (
                      <Card 
                        key={item.questionId} 
                        className={`transition-all duration-200 hover:shadow-md hover:scale-[1.02] w-full min-w-0 ${ // Added: w-full and min-w-0 for better flex in grid
                          item.isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0"> {/* Added: flex-1 and min-w-0 to prevent overflow */}
                              {item.isCorrect ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                              )}
                              <span className="font-semibold text-slate-800 text-sm truncate">Question {index + 1}</span> {/* Added: truncate for long labels */}
                            </div>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs flex-shrink-0 ${item.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} // Added: flex-shrink-0
                            >
                              {item.isCorrect ? 'Correct' : 'Incorrect'}
                            </Badge>
                          </div>
                          <CardTitle className="text-base mt-2 text-slate-700 line-clamp-2 break-words"> {/* Added: break-words for long text */}
                            {item.question}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2 text-sm">
                          {item.selectedIndex >= 0 && !item.isCorrect && (
                            <div className="p-2 bg-red-50 border border-red-200 rounded flex items-center text-xs break-words"> {/* Added: break-words */}
                              <AlertTriangle className="h-3 w-3 text-red-500 mr-1 flex-shrink-0" />
                              <span className="text-red-700 flex-1 min-w-0"> {/* Added: flex-1 and min-w-0 */}
                                Your Answer: <b>{selectedOptionText || optionLabels[item.selectedIndex]}</b>
                              </span>
                            </div>
                          )}

                          <div className="p-2 bg-green-50 border border-green-200 rounded flex items-center text-xs break-words">
                            <CheckCircle2 className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                            <span className="font-medium text-green-700 flex-1 min-w-0">
                              Correct Answer: <b>{correctOptionText || optionLabels[item.correctIndex]}</b>
                            </span>
                          </div>

                          {item.selectedIndex === -1 && (
                            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded flex items-center text-xs">
                              <AlertTriangle className="h-3 w-3 text-yellow-500 mr-1 flex-shrink-0" />
                              <span className="text-yellow-700">Not Answered</span>
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

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}