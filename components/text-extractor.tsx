'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Image as ImageIcon, Copy, Download, Upload as UploadIcon, Eye, X, AlertCircle } from 'lucide-react';
import Tesseract from 'tesseract.js';

interface TextExtractorProps {
  onExtract?: (text: string) => void;
}

export function TextExtractor({ onExtract }: TextExtractorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, etc).');
      return;
    }

    setFile(f);
    setError('');
    setText('');

    const previewURL = URL.createObjectURL(f);
    setImagePreview(previewURL);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) {
      const previewURL = URL.createObjectURL(f);
      setFile(f);
      setImagePreview(previewURL);
      setError('');
      setText('');
    } else {
      setError('Please drop a valid image file (JPG, PNG, etc).');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const extractText = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    setText('');

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => console.log(m),
      });

      setText(result.data.text);
      onExtract?.(result.data.text);
    } catch (err) {
      setError('Failed to extract text. Try another image.');
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-white/70 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 space-y-2">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <ImageIcon className="h-5 w-5 text-blue-600" />
          Image Text Extractor
        </CardTitle>
        <CardDescription className="text-slate-600">
          Upload or drop an image to extract text using AI-powered OCR. Supports JPG, PNG, and more.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Drag & Drop / Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            file
              ? 'border-blue-300 bg-blue-50/50'
              : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {!file ? (
            <>
              <UploadIcon className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-700 mb-1">Drop your image here</h3>
              <p className="text-sm text-slate-500 mb-4">or click to browse</p>
              <Button onClick={openFileDialog} variant="outline" className="border-slate-300">
                <Eye className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
            </>
          ) : (
            <>
              <Eye className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold text-slate-700 mb-1">Image Ready</h3>
              <p className="text-sm text-slate-500">Click extract to process</p>
            </>
          )}
        </div>

        {/* Hidden File Input */}
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-h-64 object-contain rounded-lg border border-slate-200 shadow-sm"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFile(null);
                setImagePreview(null);
              }}
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80"
            >
              <X className="h-4 w-4 text-slate-500" />
            </Button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="border-red-200">
            <AlertDescription className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Extract Button */}
        {file && (
          <Button onClick={extractText} className="w-full shadow-lg h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extracting Text...
              </>
            ) : (
              <>
                <UploadIcon className="mr-2 h-4 w-4" />
                Extract Text
              </>
            )}
          </Button>
        )}

        {/* Extracted Text Area */}
        {text && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-slate-700">Extracted Text</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyText} className="h-8 px-3">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadText} className="h-8 px-3">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            <Textarea
              value={text}
              readOnly
              rows={8}
              className="resize-none font-mono text-sm bg-slate-50 border-slate-200 focus:border-blue-500 ring-1 ring-slate-200"
              placeholder="Extracted text will appear here..."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}