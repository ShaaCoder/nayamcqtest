'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Header } from '@/components/ui/header';

import {
  Loader2,
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
} from 'lucide-react';

export default function UploadQuestionsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [summary, setSummary] = useState<any | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setError('');
    setSuccess(null);
    setSummary(null);
  };

  const parseFileAndUpload = async () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess(null);
    setSummary(null);

    try {
      let rows: any[] = [];

      /* ---------- CSV ---------- */
      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        });
        rows = parsed.data as any[];
      }
      /* ---------- EXCEL ---------- */
      else {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(sheet);
      }

      if (!rows.length) {
        throw new Error('File is empty or invalid.');
      }

      const res = await fetch('/api/admin/upload-questions', {
        method: 'POST',
        credentials: 'include', // 🔥 REQUIRED FOR JWT COOKIE
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rows }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess('Questions uploaded successfully!');
      setSummary(data);
      setFile(null);
    } catch (err: any) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      {/* ---------- HEADER ---------- */}
      <header className="bg-white/80 backdrop-blur border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Upload className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Bulk Upload Questions</h1>
          </div>
        </div>
      </header>

      {/* ---------- CONTENT ---------- */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-xl bg-white/80 backdrop-blur border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <CardTitle>Upload CSV / Excel</CardTitle>
            </div>
            <CardDescription>
              Required columns: subject, question_text, option_a, option_b,
              option_c, option_d, correct_index (0–3)
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <Label>Choose file</Label>
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFile}
              />
              {file && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {summary && (
              <div className="bg-slate-50 border rounded-lg p-4 text-sm space-y-1">
                <p>📥 Received: {summary.received}</p>
                <p>🧹 Cleaned: {summary.cleaned}</p>
                <p>📄 Unique in file: {summary.unique_in_file}</p>
                <p className="font-semibold text-green-700">
                  ✅ Inserted: {summary.inserted}
                </p>
                <p>🗂️ Duplicates in file: {summary.duplicates_in_file}</p>
                <p>🗃️ Duplicates in DB: {summary.duplicates_in_db}</p>
              </div>
            )}

            <Button
              onClick={parseFileAndUpload}
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Questions
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
