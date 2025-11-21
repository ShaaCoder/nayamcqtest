'use client';

import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, GraduationCap, BookOpenCheck } from "lucide-react"; // ⭐ Added missing BookOpenCheck
import Image from "next/image";
import { motion, easeOut } from 'framer-motion'; // ⭐ Added easeOut import
import { useRouter } from "next/navigation";

// ⭐ Animation Variants - Fixed TS types with easing function
const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut }, // ⭐ Use easeOut function instead of string
  },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="w-full pt-20 pb-32 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden"> {/* ⭐ Enhanced gradient & overflow */}
      {/* ⭐ Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center max-w-6xl mx-auto" // ⭐ Wider for new layout
        >
          {/* Small Label - Animated */}
          <motion.div variants={childVariants} className="inline-flex items-center px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold shadow-lg">
            <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
            AI-Powered MCQ Tool
          </motion.div>

          {/* Main Title - Split for Stagger */}
          <motion.div variants={childVariants} className="mb-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-slate-900 mb-4">
              <span className="block">Extract Text,</span>
              <span className="block text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">Generate MCQs</span>
              <span className="block"> & Practice Instantly</span>
            </h1>
            <motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-blue-600 font-semibold"
            >
              — Powered by Nayastack
            </motion.span>
          </motion.div>

          {/* Subtitle - Animated */}
          <motion.p
            variants={childVariants}
            className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Upload an image of notes or study material → Convert to text using OCR →  
            Create high-quality MCQs with AI → Save or Practice anytime. Your ultimate exam prep sidekick.
          </motion.p>

          {/* CTA Buttons - Staggered Row */}
          <motion.div
            variants={childVariants}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <motion.div variants={buttonVariants}>
              <Button
                asChild
                onClick={() => router.push('/auto-mcq')}
                className="px-8 py-6 text-xl font-bold shadow-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white rounded-full"
              >
                <motion.button whileHover="hover" whileTap="tap">
                  Start MCQ Generator
                  <ArrowRight className="h-5 w-5 ml-2" />
                </motion.button>
              </Button>
            </motion.div>

            <motion.div variants={buttonVariants}>
              <Button
                asChild
                variant="outline"
                onClick={() => router.push('/browse')}
                className="px-8 py-6 text-xl font-bold border-2 border-slate-300 hover:border-blue-500 rounded-full"
              >
                <motion.button whileHover="hover" whileTap="tap">
                  Browse Subjects
                </motion.button>
              </Button>
            </motion.div>
          </motion.div>

          {/* ⭐ Updated Layout: Side-by-Side Illustration + Features Teaser */}
          <motion.div
            variants={childVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left: Hero Image - Animated */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-slate-200">
                <Image
                  src="https://images.pexels.com/photos/1314549/pexels-photo-1314549.jpeg" // replace with your image
                  alt="AI MCQ Generator"
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover rounded-2xl"
                />
                {/* ⭐ Overlay Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  <Zap className="h-4 w-4 inline mr-1" />
                  Instant AI Magic
                </div>
              </div>
            </motion.div>

            {/* Right: Quick Features Teaser - New Addition */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6 text-left pl-0 lg:pl-8"
            >
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                <GraduationCap className="h-8 w-8 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">For Exam Warriors</h4>
                  <p className="text-sm text-slate-600">Tailored for UPSC, SSC, Banking—ace your dreams.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                <Sparkles className="h-8 w-8 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">Smart & Free</h4>
                  <p className="text-sm text-slate-600">No ads, unlimited generations—pure focus.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200">
                <BookOpenCheck className="h-8 w-8 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">Track Progress</h4>
                  <p className="text-sm text-slate-600">Save MCQs, revisit, and level up your scores.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}