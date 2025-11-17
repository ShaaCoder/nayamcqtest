  'use client';

  import { TextExtractor } from '@/components/text-extractor';
  import { Header } from '@/components/ui/header';

  export default function TextExtractorPage() {
    const handleExtract = (text: string) => {
      console.log('Extracted Text:', text);

      // You can integrate this later to:
      // - Auto-create quiz questions
      // - Store extracted text in DB
      // - Pre-fill forms
      // - Trigger AI processing
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />

        <main className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-center mb-6 text-slate-800">
            Image Text Extractor
          </h1>

          <p className="text-center text-slate-600 mb-10">
            Upload any image (JPG / PNG) and extract the text using AI.
          </p>

          <div className="max-w-2xl mx-auto">
            <TextExtractor onExtract={handleExtract} />
          </div>
        </main>
      </div>
    );
  }
