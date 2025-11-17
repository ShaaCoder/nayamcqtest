'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { Header } from '@/components/ui/header'; // New import

export default function Home() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects');
      const data = await response.json();
      setSubjects(data.subjects || []);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSelect = (subject: string) => {
    router.push(`/quiz/${encodeURIComponent(subject)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header /> {/* Inserted here */}

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Choose Your Subject</h2>
            <p className="text-lg text-muted-foreground">
              Select a subject below to start your practice quiz
            </p>
          </div>

          {subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <Card
                  key={subject}
                  className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-slate-400"
                  onClick={() => handleSubjectSelect(subject)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-xl">{subject}</CardTitle>
                    <CardDescription>
                      Start practicing {subject} questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Subjects Available</h3>
                <p className="text-muted-foreground mb-4">
                  There are no quiz subjects available at the moment.
                </p>
                <Button onClick={() => router.push('/admin/login')}>
                  Login as Admin to Add Questions
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="border-t bg-white mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>MCQ Exam Preparation System</p>
        </div>
      </footer>
    </div>
  );
}