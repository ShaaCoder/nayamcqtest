'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Code2, Rocket, ScanEye, FileText, BookOpenCheck } from "lucide-react";
import { motion, AnimatePresence, easeOut } from 'framer-motion'; // ⭐ Added easeOut import
import Image from "next/image";

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

const featureVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut }, // ⭐ Use easeOut function instead of string
  },
};

const iconVariants = {
  hover: { scale: 1.1, rotate: 5 },
};

export function AboutSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mt-20"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="py-16 px-6 lg:px-12">
          <div className="text-center max-w-5xl mx-auto">

            {/* Icon */}
            <motion.div
              className="flex justify-center mb-6"
              variants={iconVariants}
              whileHover="hover"
            >
              <Rocket className="h-12 w-12 text-blue-500 drop-shadow-sm" />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
            >
              About This Tool — Built with ❤️ by <span className="text-blue-600">Nayastack</span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-600 text-xl leading-relaxed max-w-3xl mx-auto"
            >
              This powerful educational platform is developed by 
              <span className="font-bold text-slate-800"> Shantanu Bhora</span> under 
              <span className="text-blue-500 font-bold"> Nayastack</span>.  
              It is designed to help students prepare faster using AI + Automation.
            </motion.p>

            {/* Feature Section */}
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-2xl font-bold mt-16 mb-8 text-slate-800 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-6 w-6 text-yellow-500" />
              🔥 What This Tool Can Do
            </motion.h3>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >

              {/* Feature 1 */}
              <motion.div
                variants={featureVariants}
                className="group p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
              >
                <motion.div variants={iconVariants} whileHover="hover" className="mb-4">
                  <ScanEye className="h-10 w-10 text-indigo-500" />
                </motion.div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">Extract Text from Image</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload any photo of notes, books, or printed text.  
                  Our OCR engine converts it into clean text instantly.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                variants={featureVariants}
                className="group p-6 bg-gradient-to-br from-slate-50 to-green-50 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
              >
                <motion.div variants={iconVariants} whileHover="hover" className="mb-4">
                  <FileText className="h-10 w-10 text-green-500" />
                </motion.div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">AI MCQ Generator</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The extracted text is converted into high-quality MCQs  
                  with correct answers using advanced AI.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                variants={featureVariants}
                className="group p-6 bg-gradient-to-br from-slate-50 to-orange-50 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
              >
                <motion.div variants={iconVariants} whileHover="hover" className="mb-4">
                  <BookOpenCheck className="h-10 w-10 text-orange-500" />
                </motion.div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">Subjects & Practice Questions</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Already includes multiple subjects with thousands of  
                  stored MCQs for daily practice.
                </p>
              </motion.div>

              {/* Feature 4 */}
              <motion.div
                variants={featureVariants}
                className="group p-6 bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
              >
                <motion.div variants={iconVariants} whileHover="hover" className="mb-4">
                  <Sparkles className="h-10 w-10 text-purple-500" />
                </motion.div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">Smart Automation</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  OCR → AI → MCQ Generation happens automatically  
                  with a single click.
                </p>
              </motion.div>

              {/* Feature 5 */}
              <motion.div
                variants={featureVariants}
                className="group p-6 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
              >
                <motion.div variants={iconVariants} whileHover="hover" className="mb-4">
                  <Code2 className="h-10 w-10 text-emerald-500" />
                </motion.div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">Built with Modern Tech</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Next.js, Tailwind CSS, MongoDB, Shadcn UI, OCR & AI Processing.
                </p>
              </motion.div>

              {/* Feature 6 */}
              <motion.div
                variants={featureVariants}
                className="group p-6 bg-gradient-to-br from-slate-50 to-red-50 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
              >
                <motion.div variants={iconVariants} whileHover="hover" className="mb-4">
                  <Rocket className="h-10 w-10 text-red-500" />
                </motion.div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">Made for Students</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Fast, accurate, and reliable platform for exam preparation.
                </p>
              </motion.div>

            </motion.div>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16 text-sm text-slate-500 italic flex items-center justify-center gap-2"
            >
              © {new Date().getFullYear()} Nayastack — Created & Maintained by Shantanu Bhora.
              <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
            </motion.p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}