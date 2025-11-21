'use client';

import { useRouter } from 'next/navigation';
import { GraduationCap, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Animation Variants
const logoVariants = {
  hover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } },
};

export function Header() {
  const router = useRouter();

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-white/80 backdrop-blur-sm border-b shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">

          {/* Logo + Title */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push('/')}
            whileHover="hover"
          >
            <motion.div
              variants={logoVariants}
              className="p-2 bg-gradient-to-br from-slate-900 to-blue-900 rounded-xl shadow-md"
            >
              <GraduationCap className="h-6 w-6 text-white drop-shadow-sm" />
            </motion.div>

            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent"
              >
                MCQStack
              </motion.h1>

              <p className="text-sm text-slate-500 hidden sm:block">
                AI Powered MCQ Generator & Practice
              </p>
            </div>
          </motion.div>

          {/* Nav Actions */}
          <div className="flex items-center gap-2">

            {/* Mobile Menu Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Admin Login */}
            <Button
              variant="outline"
              onClick={() => router.push('/admin/login')}
              className="border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors duration-200"
            >
              Admin Login
            </Button>
          </div>

        </div>
      </div>
    </motion.header>
  );
}
