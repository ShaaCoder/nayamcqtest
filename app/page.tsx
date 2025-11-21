'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, easeOut, cubicBezier } from 'framer-motion'; // ⭐ Added cubicBezier import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Loader2, Zap, Sparkles, ChevronDown } from 'lucide-react'; // ⭐ Added ChevronDown for potential dropdown
import { Header } from '@/components/ui/header';
import { AboutSection } from '@/components/About';
import { HeroSection } from '@/components/Herosection';
import { WhyHelpful } from '@/components/WhyHelpful';

// ⭐ Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) }, // ⭐ Use cubicBezier for custom easing
  },
};

export default function Home() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // ⭐ State for potential expand (unused for now)

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects');
      const data = await response.json();

      // ⭐ Show ONLY 3 subjects on home page
      setSubjects((data.subjects || []).slice(0, 3));

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      <Header />
      <HeroSection />

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-5xl mx-auto"> {/* ⭐ Wider max-width for better breathing */}

          {/* Title Section - Enhanced Animation */}
          <motion.div
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16" // ⭐ More space below
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Choose Your Subject
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Dive into interactive quizzes tailored to your studies. Master concepts with AI-powered practice.
            </p>
          </motion.div>

          {/* Auto MCQ Button - Prominent CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center mb-16" // ⭐ More space
          >
            <motion.div variants={buttonVariants}>
              <Button
                asChild
                onClick={() => router.push('/auto-mcq')}
                className="px-10 py-5 text-xl font-bold shadow-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white rounded-full"
              >
                <motion.button whileHover="hover" whileTap="tap">
                  <Zap className="h-5 w-5 mr-3 animate-pulse" />
                  Auto MCQ Generator
                </motion.button>
              </Button>
            </motion.div>
          </motion.div>

          {/* Subjects Grid (3 only) - Enhanced Cards */}
          <AnimatePresence mode="wait">
            {subjects.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16" // ⭐ Larger gaps
              >
                {subjects.map((subject, index) => (
                  <motion.div
                    key={subject}
                    variants={cardVariants}
                    custom={index}
                    className="group" // ⭐ For hover effects
                  >
                    <Card
                      className="hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white/90 backdrop-blur-md border-0 overflow-hidden transform hover:-translate-y-2" // ⭐ Lift on hover
                      onClick={() => handleSubjectSelect(subject)}
                    >
                      <CardHeader className="pb-6 relative overflow-hidden">
                        {/* ⭐ Gradient overlay for depth */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="flex items-center justify-between mb-4 relative z-10">
                          <motion.div
                            className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg"
                            whileHover={{ scale: 1.1, rotate: 3 }}
                            transition={{ duration: 0.3 }}
                          >
                            <BookOpen className="h-7 w-7 text-white drop-shadow-md" />
                          </motion.div>
                          <motion.div
                            initial={{ x: 0 }}
                            whileHover={{ x: 8, scale: 1.2 }}
                            className="text-slate-400"
                          >
                            <ArrowRight className="h-6 w-6" />
                          </motion.div>
                        </div>

                        <CardTitle className="text-2xl font-bold text-slate-800 relative z-10">
                          {subject}
                        </CardTitle>
                        <CardDescription className="text-slate-600 relative z-10 mt-2">
                          Practice {subject.toLowerCase()} MCQs and track your progress.
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0 relative z-10">
                        <motion.div variants={buttonVariants}>
                          <Button
                            asChild
                            className="w-full rounded-full border-2 border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold"
                          >
                            <motion.button whileHover="hover" whileTap="tap">
                              <Sparkles className="h-4 w-4 mr-2" />
                              Start Quiz
                            </motion.button>
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-slate-600 text-lg italic py-8"
              >
                No subjects available yet. Check back soon!
              </motion.p>
            )}
          </AnimatePresence>

          {/* ⭐ Browse All Button - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <motion.div variants={buttonVariants}>
              <Button
                asChild
                onClick={() => router.push('/browse')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 rounded-full font-semibold shadow-lg"
              >
                <motion.button whileHover="hover" whileTap="tap">
                  Browse All Subjects
                  <ChevronDown className="h-4 w-4 ml-2" />
                </motion.button>
              </Button>
            </motion.div>
          </motion.div>

        </div>
      </main>

      <AboutSection />
      <WhyHelpful/>
    </div>
  );
}