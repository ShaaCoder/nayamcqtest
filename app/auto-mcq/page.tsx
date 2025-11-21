'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, easeOut, cubicBezier } from 'framer-motion'; // ⭐ Added easeOut and cubicBezier imports
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Copy, Upload, Zap, CheckCircle, GraduationCap } from 'lucide-react'; // ⭐ Added GraduationCap
import { Progress } from '@/components/ui/progress'; // ⭐ Added Progress component (from Shadcn)
import { Header } from '@/components/ui/header'; // ⭐ Added Header

type MCQ = {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_index?: number;
  subject?: string;
};

// ⭐ Animation Variants - Fixed TS types with easing functions
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: cubicBezier(0.22, 1, 0.36, 1), // ⭐ Use cubicBezier function for custom bezier
    },
  }),
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const mcqItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: easeOut }, // ⭐ Use easeOut function instead of string
  },
};

export default function AutoMCQPage() {
  const [file, setFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [progress, setProgress] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false); // ⭐ Added success state for animations

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- Image Preprocess Function ---
  async function preprocessImageToBlob(file: File, maxWidth = 1400): Promise<Blob | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);

        const canvas = canvasRef.current ?? document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        const id = ctx.getImageData(0, 0, w, h);
        const data = id.data;
        const contrast = 1.08;
        const brightness = 6;
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
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

  // --- OCR Function ---
  async function runOCR(blob: Blob) {
    const Tesseract = (await import('tesseract.js')).default;

    return await Tesseract.recognize(blob, 'eng', {
      logger: (m) => {
        if (m?.status === 'recognizing text') {
          setProgress(Math.round(m.progress * 100));
        }
      },
    }).then((res) => res?.data?.text ?? '');
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(false); // ⭐ Reset success
    setMcqs([]);
    setOcrText('');
    setProgress(0);
    setFile(e.target.files?.[0] ?? null);
  };

  const handleExtract = async () => {
    if (!file) return setError('Please choose an image file first.');

    setError(null);
    setProgress(5);

    const blob = await preprocessImageToBlob(file);
    if (!blob) return setError('Failed to preprocess image.');

    const text = await runOCR(blob);
    setOcrText(text.trim());
    setProgress(100);

    if (text.trim().length < 10) {
      setError('OCR returned too little text. Try a clearer image.');
    }
  };

  const handleGenerate = async () => {
    if (!ocrText || ocrText.trim().length < 20) {
      return setError('Extracted text is too short.');
    }

    setGenerating(true);
    const res = await fetch('/api/mcq/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ extractedText: ocrText }),
    });

    const data = await res.json();
    setGenerating(false);

    if (!res.ok) return setError(data.error || 'MCQ generation failed.');

    setMcqs(data.mcqs || []);
  };

  const handleSave = async () => {
    if (mcqs.length === 0) return setError('No MCQs to save.');

    setSaving(true);
    const res = await fetch('/api/questions/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions: mcqs }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) return setError(data.error || 'Save failed');

    setSuccess(true); // ⭐ Trigger success animation
    setTimeout(() => setSuccess(false), 3000); // ⭐ Auto-hide after 3s
    alert('Saved MCQs successfully.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"> {/* ⭐ Subtle gradient background */}
      {/* ⭐ Header Added at Top */}
      <Header />

      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Page Title - Animated */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4 mb-10"
        >
          {/* ⭐ Replaced img with GraduationCap icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
            className="p-3 bg-gradient-to-br from-slate-900 to-blue-900 rounded-xl shadow-md"
          >
            <GraduationCap className="h-8 w-8 text-white drop-shadow-sm" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Auto MCQ Generator
            </h1> {/* ⭐ Gradient text for title */}
            <p className="text-sm text-slate-600 mt-1">
              Upload an image → Extract text → Convert into MCQs instantly.
            </p>
          </div>
        </motion.div>

        {/* Step 1 - Animated Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm"> {/* ⭐ Enhanced shadow & backdrop */}
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-500" /> {/* ⭐ Icon */}
                Step 1 — Upload & Extract
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                /> {/* ⭐ Styled file input */}

                <div className="flex gap-2">
                  <motion.div variants={buttonVariants}>
                    <Button
                      asChild
                      onClick={handleExtract}
                      disabled={!file || progress > 0}
                      className="flex-1"
                    >
                      <motion.button whileHover="hover" whileTap="tap">
                        {progress > 0 && progress < 100 ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Extracting...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" /> {/* ⭐ Icon */}
                            Extract Text
                          </>
                        )}
                      </motion.button>
                    </Button>
                  </motion.div>

                  <motion.div variants={buttonVariants}>
                    <Button
                      variant="outline"
                      asChild
                      onClick={() => {
                        setFile(null);
                        setOcrText('');
                        setMcqs([]);
                        setError(null);
                        setSuccess(false);
                        setProgress(0);
                      }}
                    >
                      <motion.button whileHover="hover" whileTap="tap">
                        Reset
                      </motion.button>
                    </Button>
                  </motion.div>
                </div>
              </div>

              <AnimatePresence> {/* ⭐ Animate progress bar */}
                {progress > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <p className="text-sm font-medium text-slate-700 mb-2">OCR Progress</p>
                    <Progress value={progress} className="w-full h-2" />
                    <p className="text-xs text-slate-500 mt-1">{progress}%</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence> {/* ⭐ Animate error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" /> {/* ⭐ Icon for error (ironic but fits) */}
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait"> {/* ⭐ Animate extracted text section */}
                {ocrText && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-5"
                  >
                    <h3 className="font-semibold mb-2 flex items-center gap-2 text-slate-800">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Extracted Text
                    </h3>
                    <motion.textarea
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-full p-3 border rounded-lg bg-white text-sm resize-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={10}
                      value={ocrText}
                      onChange={(e) => setOcrText(e.target.value)}
                    />

                    <motion.div variants={buttonVariants} className="mt-3">
                      <Button
                        variant="outline"
                        asChild
                        onClick={() => navigator.clipboard.writeText(ocrText)}
                      >
                        <motion.button whileHover="hover" whileTap="tap">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Text
                        </motion.button>
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Step 2 - Animated Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={1}
          className="mt-10"
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-indigo-500" />
                Step 2 — Generate MCQs (AI)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div variants={buttonVariants}>
                <Button
                  asChild
                  onClick={handleGenerate}
                  disabled={generating || !ocrText}
                  className="w-full flex items-center justify-center"
                >
                  <motion.button whileHover="hover" whileTap="tap">
                    {generating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate MCQs
                      </>
                    )}
                  </motion.button>
                </Button>
              </motion.div>

              <AnimatePresence mode="wait"> {/* ⭐ Staggered MCQ animation */}
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
                        className="p-4 border rounded-lg bg-gradient-to-br from-white to-slate-50 shadow-sm hover:shadow-md transition-all duration-200 border-slate-200"
                      >
                        <p className="font-medium text-slate-800 mb-3">
                          {i + 1}. {q.question_text}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
                          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded text-blue-800">
                            <span className="font-semibold">A.</span> {q.option_a}
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded text-green-800">
                            <span className="font-semibold">B.</span> {q.option_b}
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded text-yellow-800">
                            <span className="font-semibold">C.</span> {q.option_c}
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded text-purple-800">
                            <span className="font-semibold">D.</span> {q.option_d}
                          </div>
                        </div>
                        <motion.p // ⭐ Animate correct answer
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-green-700 text-sm mt-3 font-semibold flex items-center gap-1 bg-green-50 px-2 py-1 rounded" // ⭐ Removed duplicate 'inline-flex' to fix Tailwind conflict
                        >
                          <CheckCircle className="h-3 w-3" />
                          Correct: {['A', 'B', 'C', 'D'][q.correct_index ?? 0]}
                        </motion.p>
                      </motion.div>
                    ))}

                    <div className="flex flex-col sm:flex-row gap-2 mt-6 pt-4 border-t border-slate-200">
                      <motion.div variants={buttonVariants}>
                        <Button
                          asChild
                          onClick={handleSave}
                          disabled={saving}
                          className="flex-1"
                        >
                          <motion.button whileHover="hover" whileTap="tap">
                            <Save className="h-4 w-4 mr-2" />
                            {saving ? 'Saving...' : 'Save All'}
                          </motion.button>
                        </Button>
                      </motion.div>

                      <motion.div variants={buttonVariants}>
                        <Button
                          variant="outline"
                          asChild
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(mcqs))}
                        >
                          <motion.button whileHover="hover" whileTap="tap">
                            Copy JSON
                          </motion.button>
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {mcqs.length === 0 && !generating && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-sm text-slate-500 italic"
                >
                  No MCQs yet — hit the button above to generate some magic! ✨
                </motion.p>
              )}

              {/* ⭐ Success Animation */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5 animate-pulse" />
                    MCQs saved successfully! 🎉
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}