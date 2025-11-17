'use client';

import { useRouter } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const router = useRouter();

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">MCQ Exam Prep</h1>
              <p className="text-sm text-muted-foreground">Test your knowledge</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => router.push('/admin/login')}>
            Admin Login
          </Button>
        </div>
      </div>
    </header>
  );
}