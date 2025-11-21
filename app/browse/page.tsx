'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence, easeOut } from 'framer-motion'; // ⭐ Added easeOut import
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Loader2, Play, Lightbulb, Target, Clock, Zap, Sparkles } from "lucide-react"; // ⭐ Added usage icons
import { useRouter } from "next/navigation";
import { Header } from "@/components/ui/header";

// ⭐ Animation Variants - Fixed TS types with easing function
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
    transition: { duration: 0.5, ease: easeOut }, // ⭐ Use easeOut function instead of string
  },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

const stepVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export default function BrowseSubjectsPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      setSubjects(data.subjects || []);
    } catch (err) {
      console.error("Failed to load subjects", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"> {/* ⭐ Gradient bg for consistency */}
      <Header />

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Heading - Animated */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Browse All Subjects
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore every subject and dive into MCQs, quizzes, and AI-generated practice tailored just for you.
          </p>
        </motion.div>

        {/* Loading - Animated Spinner */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-12"
            >
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-slate-500">Loading subjects...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Subjects - Animated Fallback */}
        <AnimatePresence mode="wait">
          {!loading && subjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-2xl font-semibold mb-2 text-slate-800">No Subjects Yet</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Head to the Admin Panel to add some exciting subjects and get started!
              </p>
              <Button onClick={() => router.push('/admin/login')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                Admin Login
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subjects Grid - Staggered Animation */}
        <AnimatePresence mode="wait">
          {!loading && subjects.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20" // ⭐ Larger gaps & more space below
            >
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject}
                  variants={cardVariants}
                  custom={index}
                  className="group" // ⭐ For hover effects
                >
                  <Card
                    className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm overflow-hidden hover:-translate-y-1" // ⭐ Enhanced hover lift, no border
                    onClick={() => router.push(`/quiz/${encodeURIComponent(subject)}`)}
                  >
                    <CardHeader className="pb-6 relative">
                      {/* ⭐ Subtle gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <motion.div
                          className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md" // ⭐ Gradient icon bg
                          whileHover={{ scale: 1.1, rotate: 3 }}
                          transition={{ duration: 0.3 }}
                        >
                          <BookOpen className="h-6 w-6 text-white" />
                        </motion.div>
                        <motion.div
                          initial={{ x: 0 }}
                          whileHover={{ x: 6, scale: 1.1 }}
                          className="text-slate-400"
                        >
                          <ArrowRight className="h-5 w-5" />
                        </motion.div>
                      </div>

                      <CardTitle className="text-xl font-bold text-slate-800 relative z-10 mt-2">
                        {subject}
                      </CardTitle>
                      <CardDescription className="text-slate-600 relative z-10">
                        Open MCQs & Practice Questions
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0 relative z-10">
                      <motion.div variants={buttonVariants}>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full rounded-full border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold"
                        >
                          <motion.button whileHover="hover" whileTap="tap">
                            Start Quiz
                          </motion.button>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ⭐ NEW: How to Use Section - Step-by-Step Guide */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              How to Use This Page
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Discover subjects effortlessly and supercharge your learning. Here's your quick guide:
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Step 1 */}
            <motion.div variants={stepVariants} className="text-center group">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <motion.div
                    className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Play className="h-6 w-6 text-white" />
                  </motion.div>
                  <CardTitle className="text-lg font-bold text-green-800">1. Browse & Select</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Scroll through all available subjects. Click on any card to jump straight into quizzes and MCQs.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={stepVariants} className="text-center group">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <motion.div
                    className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Lightbulb className="h-6 w-6 text-white" />
                  </motion.div>
                  <CardTitle className="text-lg font-bold text-blue-800">2. Practice Smart</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Each subject unlocks hundreds of AI-curated questions. Track scores, retry weak areas, and learn on the go.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={stepVariants} className="text-center group">
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <motion.div
                    className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Target className="h-6 w-6 text-white" />
                  </motion.div>
                  <CardTitle className="text-lg font-bold text-purple-800">3. Level Up</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Generate custom MCQs from your notes using AI. Save progress and revisit anytime for exam mastery.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* ⭐ NEW: Quick Stats Section - Engaging Metrics */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Why Choose Us?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join thousands of students acing exams with smart tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md"
            >
              <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-slate-800 mb-1">5 Min/Quiz</h3>
              <p className="text-sm text-slate-600">Quick sessions fit your busy schedule</p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md"
            >
              <Zap className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-slate-800 mb-1">AI-Powered</h3>
              <p className="text-sm text-slate-600">Generate unlimited custom questions</p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md"
            >
              <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-slate-800 mb-1">100% Free</h3>
              <p className="text-sm text-slate-600">No ads, no limits—pure learning</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Back to Home CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="px-8 py-4 text-lg border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 rounded-full"
          >
            ← Back to Home
          </Button>
        </motion.div>

      </div>
    </div>
  );
}