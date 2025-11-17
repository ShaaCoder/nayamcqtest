'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { SimpleProgress as Progress } from '@/components/simple-progress';
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
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

  useEffect(() => {
    fetchQuestions();
  }, [subject]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/questions?subject=${encodeURIComponent(subject)}`);
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
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const selectedAnswer = answers.get(currentQuestion?.id);
  const isComplete = answers.size === questions.length;

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, optionIndex);
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
      const answersArray = questions.map(q => ({
        questionId: q.id,
        selectedIndex: answers.get(q.id) ?? -1,
      }));

      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersArray, subject }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submit failed');
      }

      router.push(`/quiz/${encodeURIComponent(subject)}/result?id=${data.id}`);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-600" />
          <p className="text-sm text-slate-500">Loading quiz...</p>
        </div>
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
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Button variant="ghost" onClick={() => router.push('/')} className="hover:bg-slate-100 -ml-1 sm:-ml-0">
                  <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" /> Back to Subjects
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleEndTest}
                  className="flex items-center space-x-1 hover:bg-red-100"
                  aria-label="End test early"
                >
                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">End Test</span>
                  <span className="sm:hidden">End</span>
                </Button>
              </div>
              <div className="text-center flex-1 px-2 sm:px-4 order-2 sm:order-1">
                <h1 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">{subject}</h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Question {currentIndex + 1} of {questions.length}
                </p>
              </div>
              <div className="w-full sm:w-24 flex justify-end order-3">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isComplete 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {answers.size}/{questions.length} answered
                </div>
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <Progress 
                value={progress} 
                className="h-1.5 sm:h-2 bg-slate-200 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-600" 
              />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <div className="max-w-full sm:max-w-3xl mx-auto">
            <Card className={`shadow-xl border-0 bg-white/70 backdrop-blur-sm overflow-hidden transition-all duration-300 w-full ${
              showFeedback ? 'scale-105 ring-2 ring-green-200' : ''
            }`}>
              {showFeedback && (
                <div className="absolute inset-0 bg-green-500/10 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
                  <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 animate-bounce" />
                  <span className="hidden sm:inline ml-2 text-green-700 font-medium">Answered!</span>
                </div>
              )}
              <CardHeader className="pb-3 sm:pb-4 relative z-20">
                <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-0">
                  <div className="flex-1">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800 mb-1 sm:mb-2 leading-relaxed line-clamp-2">
                      {currentQuestion.question_text}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-slate-600">Select the correct answer below.</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 relative z-20">
                <RadioGroup
                  value={selectedAnswer?.toString()}
                  onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                  className="space-y-2 sm:space-y-4"
                >
                  <div className="space-y-2 sm:space-y-3">
                    {options.map(option => (
                      <div
                        key={option.index}
                        className={`group flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${
                          selectedAnswer === option.index
                            ? 'border-blue-500 bg-blue-50/50 backdrop-blur-sm shadow-lg'
                            : 'border-slate-200 hover:border-slate-300 bg-white/50'
                        }`}
                        onClick={() => handleAnswerSelect(option.index)}
                        role="radio"
                        aria-checked={selectedAnswer === option.index}
                      >
                        <RadioGroupItem 
                          value={option.index.toString()} 
                          id={`option-${option.index}`} 
                          className="border-2 border-slate-300 flex-shrink-0"
                        />
                        <Label 
                          htmlFor={`option-${option.index}`} 
                          className="flex-1 cursor-pointer text-sm sm:text-base font-medium text-slate-700 group-hover:text-slate-900 leading-relaxed"
                        >
                          <span className="font-bold text-base sm:text-lg text-slate-600 mr-2 sm:mr-3">{option.label}.</span>
                          <span className="break-words">{option.value}</span>
                        </Label>
                        {selectedAnswer === option.index && (
                          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 ml-auto shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 gap-3 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="px-4 sm:px-6 py-2 border-slate-300 hover:bg-slate-50 flex-1 sm:flex-none order-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                  </Button>

                  <div className="flex-1 text-center order-2">
                    {/* Optional: Add a per-question timer here */}
                    {/* <div className="text-xs sm:text-sm text-slate-500 mb-1 sm:mb-2">Time left: 2:30</div> */}
                  </div>

                  {currentIndex < questions.length - 1 ? (
                    <Button 
                      onClick={handleNext}
                      className="px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 flex-1 sm:flex-none order-3 sm:ml-auto"
                    >
                      Next <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleSubmit(false)} 
                      disabled={submitting}
                      className={`px-4 sm:px-6 py-2 flex-1 sm:flex-none order-3 sm:ml-auto ${
                        submitting ? 'bg-slate-400' : isComplete ? 'bg-green-500 hover:bg-green-600' : 'bg-indigo-500 hover:bg-indigo-600'
                      }`}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          {isComplete ? 'Finish Quiz' : 'Submit Quiz'} 
                          <CheckCircle2 className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4 sm:mt-6 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-base sm:text-lg font-semibold text-slate-800">Question Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 sm:gap-2 overflow-x-auto pb-2">
                  {questions.map((q, idx) => (
                    <Button
                      key={q.id}
                      variant={
                        currentIndex === idx
                          ? 'default'
                          : answers.has(q.id)
                          ? 'secondary'
                          : 'outline'
                      }
                      size="sm"
                      className="h-7 sm:h-8 px-2 sm:px-3 text-xs flex-shrink-0 min-w-[2.5rem]"
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Jump to question ${idx + 1}`}
                    >
                      {idx + 1}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {showEndModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-4 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                {isComplete ? (
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                )}
                <h3 className="text-base sm:text-lg font-semibold text-slate-800">End Test Early?</h3>
              </div>
              <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 leading-relaxed">
                {isComplete 
                  ? 'You’ve completed all questions. Ready to see your results?'
                  : `You have ${questions.length - answers.size} unanswered questions. This will submit your current answers.`
                }
              </p>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowEndModal(false)}
                  className="px-4 py-2 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleSubmit(true)} 
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 w-full sm:w-auto"
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