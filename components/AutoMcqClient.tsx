'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, easeOut, cubicBezier } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Loader2,
  Save,
  Copy,
  Upload,
  Zap,
  CheckCircle,
  GraduationCap,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/ui/header';

type MCQ = {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_index?: number;
  subject?: string;
};

// ---- animations ----
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: cubicBezier(0.22, 1, 0.36, 1),
    },
  }),
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const staggerContainer = {
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const mcqItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
};

export default function AutoMcqClient() {
  const [file, setFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [progress, setProgress] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ---- Preprocess Image ----
  async function preprocessImageToBlob(file: File): Promise<Blob | null> {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        const maxWidth = 1400;
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);

        const canvas = canvasRef.current ?? document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        const id = ctx.getImageData(0, 0, w, h);
        const data = id.data;

        const contrast = 1.08;
        const brightness = 6;
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i],
            g = data[i + 1],
            b = data[i + 2];
          const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

          let v = Math.round(factor * (gray - 128) + 128 + brightness);
          v = Math.min(255, Math.max(0, v));

          data[i] = data[i + 1] = data[i + 2] = v;
        }

        ctx.putImageData(id, 0, 0);

        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92);
      };

      img.onerror = () => resolve(null);

      const reader = new FileReader();
      reader.onload = () => {
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }

  // ---- OCR ----
  async function runOCR(blob: Blob) {
    const Tesseract = (await import('tesseract.js')).default;

    return await Tesseract.recognize(blob, 'eng', {
      logger: (m: any) => {
        if (m?.status === 'recognizing text') {
          setProgress(Math.round(m.progress * 100));
        }
      },
    }).then((res: any) => res?.data?.text || '');
  }

  // ---- Handlers ----
  const handleFileChange = (e: any) => {
    setError(null);
    setSuccess(false);
    setMcqs([]);
    setOcrText('');
    setProgress(0);
    setFile(e.target.files?.[0] ?? null);
  };

  const handleExtract = async () => {
    if (!file) return setError('Please choose an image.');

    setError(null);
    setProgress(5);

    const blob = await preprocessImageToBlob(file);
    if (!blob) return setError('Image preprocessing failed.');

    const text = await runOCR(blob);
    setOcrText(text.trim());
    setProgress(100);

    if (text.trim().length < 10) setError('OCR returned very little text.');
  };

  const handleGenerate = async () => {
    if (!ocrText) return setError('No extracted text present.');

    setGenerating(true);
    const res = await fetch('/api/mcq/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ extractedText: ocrText }),
    });

    const data = await res.json();
    setGenerating(false);

    if (!res.ok) return setError(data.error || 'MCQ generation failed.');

    setMcqs(data.mcqs);
  };

  const handleSave = async () => {
    if (!mcqs.length) return setError('No MCQs to save.');

    setSaving(true);
    const res = await fetch('/api/questions/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions: mcqs }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) return setError(data.error || 'Save error.');

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  // ---- UI ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* ---- Header ---- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="p-3 bg-slate-900 rounded-xl shadow-md">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              Auto MCQ Generator
            </h1>
            <p className="text-slate-600 text-sm">
              Upload image → Extract text → Generate MCQs instantly.
            </p>
          </div>
        </motion.div>

        {/* ---- Step 1 Card ---- */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0}>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="h-5 w-5 text-blue-500" />
                Step 1 — Upload & Extract
              </CardTitle>
            </CardHeader>

            <CardContent>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm file:bg-blue-100 file:text-blue-700 file:rounded-lg file:px-4 file:py-2"
              />

              <div className="flex gap-3 mt-4">
                <Button onClick={handleExtract} disabled={!file}>
                  Extract Text
                </Button>

                <Button variant="outline" onClick={() => {
                  setError(null);
                  setFile(null);
                  setOcrText('');
                  setMcqs([]);
                  setProgress(0);
                }}>
                  Reset
                </Button>
              </div>

              {progress > 0 && (
                <div className="mt-4">
                  <Progress value={progress} />
                </div>
              )}

              {ocrText && (
                <textarea
                  className="w-full p-3 mt-5 border rounded-lg bg-white"
                  rows={10}
                  value={ocrText}
                  onChange={(e) => setOcrText(e.target.value)}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ---- Step 2 ---- */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1} className="mt-10">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-indigo-500" />
                Step 2 — Generate MCQs (AI)
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Button className="w-full" onClick={handleGenerate} disabled={!ocrText}>
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate MCQs"}
              </Button>

              {/* MCQ List */}
              <AnimatePresence>
                {mcqs.length > 0 && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="mt-6 space-y-4"
                  >
                    {mcqs.map((q, i) => (
                      <motion.div
                        key={i}
                        variants={mcqItemVariants}
                        className="p-4 border rounded-lg bg-white shadow-sm"
                      >
                        <p className="font-semibold">{i + 1}. {q.question_text}</p>

                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                          <div>A. {q.option_a}</div>
                          <div>B. {q.option_b}</div>
                          <div>C. {q.option_c}</div>
                          <div>D. {q.option_d}</div>
                        </div>

                        <p className="text-green-700 font-medium mt-2">
                          ✓ Correct: {['A', 'B', 'C', 'D'][q.correct_index ?? 0]}
                        </p>
                      </motion.div>
                    ))}

                    {/* Save Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save All'}
                      </Button>

                      <Button variant="outline" onClick={() => navigator.clipboard.writeText(JSON.stringify(mcqs))}>
                        Copy JSON
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {success && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 border rounded-lg flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> Saved Successfully!
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
