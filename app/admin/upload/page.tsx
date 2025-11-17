'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Upload, FileText, CheckCircle } from 'lucide-react';
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Header } from '@/components/ui/header';

export default function UploadQuestionsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
      setError('');
      setSuccess('');
    }
  };

  const parseFile = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      let rows: any[] = [];

      if (file.name.endsWith(".csv")) {
        const text = await file.text();
        const parsed = Papa.parse(text, { header: true });
        rows = parsed.data as any[];
      } else {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(sheet);
      }

      if (rows.length === 0) {
        throw new Error('No data found in the file.');
      }

      const res = await fetch("/api/admin/upload-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });

      const data = await res.json();
      setUploading(false);

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccess(`Uploaded ${data.count || rows.length} questions successfully!`);
      setFile(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Upload className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">Bulk Upload Questions</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              <CardTitle>Upload File</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Select a CSV or Excel file with columns: subject, question_text, option_a, option_b, option_c, option_d, correct_index (0-3).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Choose File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFile}
                className="ring-1 ring-slate-200 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {file && (
                <p className="text-sm text-slate-600 mt-1">Selected: {file.name}</p>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="flex items-center">{success}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={parseFile} 
              disabled={uploading || !file} 
              className="w-full shadow-lg h-10 bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
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