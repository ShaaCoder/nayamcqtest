'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, Edit, Trash2, LogOut, BookOpen, Upload, Eye } from 'lucide-react';
import { Question, QuestionInput } from '@/lib/types';
import { Header } from '@/components/ui/header';

export default function AdminDashboard() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<QuestionInput>({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_index: 0,
    subject: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

// useEffect(() => {
//   const init = async () => {
//     await verifyAdmin();
//     await fetchQuestions();
//   };

//   init();
// }, []);


//   const verifyAdmin = async () => {
//     try {
//       const response = await fetch('/api/admin/verify');
//       if (!response.ok) {
//         router.push('/admin/login');
//       }
//     } catch (error) {
//       router.push('/admin/login');
//     }
//   };
useEffect(() => {
  fetchQuestions();
}, []);


const fetchQuestions = async () => {
  try {
  const response = await fetch('/api/questions', {
  credentials: 'include',
});


    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    const data = await response.json();

    // ✅ Handle ALL possible API shapes safely
    if (Array.isArray(data)) {
      setQuestions(data);
    } else if (Array.isArray(data.questions)) {
      setQuestions(data.questions);
    } else {
      setQuestions([]); // fallback
    }
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    setQuestions([]);
  } finally {
    setLoading(false);
  }
};



  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleOpenDialog = (question?: Question) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        question_text: question.question_text,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d,
        correct_index: question.correct_index,
        subject: question.subject,
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_index: 0,
        subject: '',
      });
    }
    setError('');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingQuestion(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const url = editingQuestion
        ? `/api/questions/${editingQuestion.id}`
        : '/api/questions';
      const method = editingQuestion ? 'PUT' : 'POST';

  const response = await fetch(url, {
  method,
  credentials: 'include', // 🔥 REQUIRED
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
});


      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save question');
      }

      await fetchQuestions();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await fetch(`/api/questions/${id}`, {
  method: 'DELETE',
  credentials: 'include',
});

      if (!response.ok) throw new Error('Failed to delete question');
      await fetchQuestions();
    } catch (error) {
      alert('Failed to delete question');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Admin Dashboard</h1>
            </div>
            <Button variant="outline" onClick={handleLogout} size="sm" className="w-full sm:w-auto">
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Logout
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
            <div className="w-full sm:w-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Questions Management</h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Total Questions: <span className="font-medium">{questions.length}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button onClick={() => handleOpenDialog()} size="sm" className="w-full sm:w-auto">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Add Question
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/upload')} className="w-full sm:w-auto">
                <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Upload
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/text')} className="w-full sm:w-auto">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Extract
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {questions.map((question) => (
              <Card key={question.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg font-semibold text-slate-800 leading-tight line-clamp-2">
                        {question.question_text}
                      </CardTitle>
                      <CardDescription className="mt-1 sm:mt-2 text-xs sm:text-sm">
                        Subject: <span className="font-medium">{question.subject}</span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(question)}
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(question.id)}
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {['option_a', 'option_b', 'option_c', 'option_d'].map((key, index) => (
                      <div
                        key={key}
                        className={`p-2 sm:p-3 rounded-lg border text-xs sm:text-sm transition-colors ${
                          question.correct_index === index
                            ? 'bg-green-50 border-green-300'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="font-medium text-slate-700">
                          {String.fromCharCode(65 + index)}.
                        </span>{' '}
                        <span className="text-slate-600 break-words">{question[key as keyof Question]}</span>
                        {question.correct_index === index && (
                          <span className="ml-1 sm:ml-2 inline-flex items-center px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            ✓ Correct
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {questions.length === 0 && (
              <Card className="shadow-sm">
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-3 text-slate-400 sm:h-12 sm:w-12 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-slate-700">No Questions Yet</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Start by adding your first question or use bulk upload.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button size="sm" onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Add One
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => router.push('/admin/upload')} className="w-full sm:w-auto">
                      <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Bulk Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </DialogTitle>
              <DialogDescription className="text-sm">
                Fill in the details below to {editingQuestion ? 'update' : 'create'} a question.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics, Science, History"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter your question"
                    value={formData.question_text}
                    onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                    rows={3}
                    required
                    className="text-sm resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="option_a">Option A</Label>
                    <Input
                      id="option_a"
                      placeholder="First option"
                      value={formData.option_a}
                      onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="option_b">Option B</Label>
                    <Input
                      id="option_b"
                      placeholder="Second option"
                      value={formData.option_b}
                      onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="option_c">Option C</Label>
                    <Input
                      id="option_c"
                      placeholder="Third option"
                      value={formData.option_c}
                      onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="option_d">Option D</Label>
                    <Input
                      id="option_d"
                      placeholder="Fourth option"
                      value={formData.option_d}
                      onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="correct_answer">Correct Answer</Label>
                  <Select
                    value={formData.correct_index.toString()}
                    onValueChange={(value) => setFormData({ ...formData, correct_index: parseInt(value) })}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Option A</SelectItem>
                      <SelectItem value="1">Option B</SelectItem>
                      <SelectItem value="2">Option C</SelectItem>
                      <SelectItem value="3">Option D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={handleCloseDialog} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingQuestion ? 'Update Question' : 'Add Question'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}