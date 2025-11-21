'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Brain, Timer, FileSearch, BookOpenCheck, Target, Layers, Play, Lightbulb, Zap, Sparkles } from "lucide-react"; // ⭐ Added more icons for variety
import { motion, easeOut } from 'framer-motion'; // ⭐ Added easeOut import

// ⭐ Animation Variants - Fixed TS types with easing function
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: easeOut }, // ⭐ Use easeOut function instead of string
  },
};

const iconVariants = {
  hover: { scale: 1.1, rotate: 5 },
};

export function WhyHelpful() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mt-24"
    >
      <div className="text-center max-w-4xl mx-auto mb-16"> {/* ⭐ Wider max-w & more space */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight"
        >
          Why This Tool Is Extremely Helpful for Students
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
        >
          Tailored for Government exam aspirants, competitive test takers, college students, 
          and anyone mastering MCQs. Unlock smarter prep with AI magic!
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"> {/* ⭐ Added mb-12 for new section */}

        {/* 1 — Saves Time */}
        <motion.div variants={cardVariants} className="group">
          <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border-slate-200 group-hover:border-blue-300">
            <CardContent className="p-8 text-center relative z-10"> {/* ⭐ More padding */}
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-6 shadow-md group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
              >
                <Timer className="h-10 w-10 text-blue-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Saves Hours of Time</h3>
              <p className="text-slate-600 leading-relaxed">
                Skip manual typing—upload an image of your notes and get ready-to-use MCQs in seconds. Reclaim your study time!
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 2 — Accurate OCR */}
        <motion.div variants={cardVariants} className="group">
          <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border-slate-200 group-hover:border-indigo-300">
            <CardContent className="p-8 text-center relative z-10">
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                className="p-4 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full mx-auto mb-6 shadow-md group-hover:from-indigo-200 group-hover:to-indigo-300 transition-colors duration-300"
              >
                <FileSearch className="h-10 w-10 text-indigo-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Accurate Text Extraction</h3>
              <p className="text-slate-600 leading-relaxed">
                Advanced OCR handles handwritten or printed notes with 95%+ accuracy. Say goodbye to transcription errors.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3 — AI MCQ Generation */}
        <motion.div variants={cardVariants} className="group">
          <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border-slate-200 group-hover:border-purple-300">
            <CardContent className="p-8 text-center relative z-10">
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mx-auto mb-6 shadow-md group-hover:from-purple-200 group-hover:to-purple-300 transition-colors duration-300"
              >
                <Brain className="h-10 w-10 text-purple-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">AI-Powered MCQ Generator</h3>
              <p className="text-slate-600 leading-relaxed">
                Cutting-edge AI crafts exam-level MCQs with distractors and explanations. Tailored to your notes for deeper understanding.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 4 — Helps Gov Exam Students */}
        <motion.div variants={cardVariants} className="group">
          <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border-slate-200 group-hover:border-green-300">
            <CardContent className="p-8 text-center relative z-10">
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full mx-auto mb-6 shadow-md group-hover:from-green-200 group-hover:to-green-300 transition-colors duration-300"
              >
                <Target className="h-10 w-10 text-green-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Perfect for Govt. Exam Prep</h3>
              <p className="text-slate-600 leading-relaxed">
                Optimized for SSC, Railway, Banking, Defence, UPSC Prelims & State Exams. Focus on high-yield topics that matter.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 5 — Daily Practice Ready */}
        <motion.div variants={cardVariants} className="group">
          <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border-slate-200 group-hover:border-orange-300">
            <CardContent className="p-8 text-center relative z-10">
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                className="p-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mx-auto mb-6 shadow-md group-hover:from-orange-200 group-hover:to-orange-300 transition-colors duration-300"
              >
                <BookOpenCheck className="h-10 w-10 text-orange-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Daily Practice & Revision</h3>
              <p className="text-slate-600 leading-relaxed">
                Thousands of subject-wise MCQs ready for daily drills. Built-in tracking to spot and crush weak spots.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 6 — Organized Study */}
        <motion.div variants={cardVariants} className="group">
          <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border-slate-200 group-hover:border-red-300">
            <CardContent className="p-8 text-center relative z-10">
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                className="p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full mx-auto mb-6 shadow-md group-hover:from-red-200 group-hover:to-red-300 transition-colors duration-300"
              >
                <Layers className="h-10 w-10 text-red-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Organized Study in One Place</h3>
              <p className="text-slate-600 leading-relaxed">
                Centralized dashboard for all MCQs—search, filter, and export. Streamline your prep like a pro.
              </p>
            </CardContent>
          </Card>
        </motion.div>

      </div>

      {/* ⭐ NEW: Quick Tips Section - How They Can Use It */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Pro Tips to Maximize Your Prep
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get the most out of this tool with these simple strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tip 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors"
          >
            <div className="p-2 bg-emerald-100 rounded-lg mt-1">
              <Play className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Start with Core Topics</h4>
              <p className="text-sm text-slate-600">
                Focus on high-weightage areas first. Use the AI generator for custom quizzes on weak spots.
              </p>
            </div>
          </motion.div>

          {/* Tip 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 hover:border-teal-300 transition-colors"
          >
            <div className="p-2 bg-teal-100 rounded-lg mt-1">
              <Lightbulb className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Daily 30-Min Drills</h4>
              <p className="text-sm text-slate-600">
                Set aside time for timed practice. Review explanations to build conceptual clarity fast.
              </p>
            </div>
          </motion.div>

          {/* Tip 3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 hover:border-orange-300 transition-colors"
          >
            <div className="p-2 bg-orange-100 rounded-lg mt-1">
              <Zap className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Mix Subjects Weekly</h4>
              <p className="text-sm text-slate-600">
                Rotate between subjects to simulate exam variety. Export MCQs for offline revision.
              </p>
            </div>
          </motion.div>

          {/* Tip 4 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 hover:border-purple-300 transition-colors"
          >
            <div className="p-2 bg-purple-100 rounded-lg mt-1">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Track & Adapt</h4>
              <p className="text-sm text-slate-600">
                Monitor your scores over time. Let AI refine questions based on your performance patterns.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

    </motion.section>
  );
}