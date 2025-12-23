'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { GraduationCap, Menu, X } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Assuming you have shadcn's cn utility
import { motion, AnimatePresence, easeOut } from 'framer-motion';

// Animation Variants
const logoVariants = {
  hover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } },
};

const subjectButtonVariants = {
  hover: { 
    scale: 1.05, 
    y: -2, 
  },
  tap: { scale: 0.98 },
};

const mobileMenuVariants = {
  hidden: { 
    opacity: 0, 
    x: '100%' 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: easeOut }
  },
  exit: { 
    opacity: 0, 
    x: '100%',
    transition: { duration: 0.2 }
  }
};

export function Header() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects');
      const data = await response.json();

      // Fetch all subjects for header, but limit display to 4 for space (adjust as needed)
      setSubjects((data.subjects || []).slice(0, 4));

    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSelect = (subject: string) => {
    router.push(`/quiz/${encodeURIComponent(subject)}`);
    setIsMenuOpen(false); // Close menu on select
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    if (isMenuOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-white border-b shadow-lg sticky top-0 z-50" // Full opaque bg-white for max contrast
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

          {/* Subjects Navigation - Hidden on mobile, shown on md+ */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-center max-w-xs overflow-hidden bg-white/95 px-2 py-1 rounded-lg"> {/* Subtle bg container for isolation */}
            {loading ? (
              // Simple skeleton loader for subjects
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-20 bg-slate-200 rounded-md animate-pulse flex-shrink-0"
                  />
                ))}
              </div>
            ) : (
              subjects.map((subject, index) => (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex-shrink min-w-0"
                >
                  <motion.button
                    variants={subjectButtonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                    }}
                    onClick={() => handleSubjectSelect(subject)}
                    className={cn(
                      buttonVariants({ 
                        variant: "ghost", 
                        size: "sm",
                        className: "text-slate-800 hover:text-blue-600 hover:bg-blue-50/100 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm truncate max-w-[100px] shadow-sm bg-white/80" // Solid hover bg + subtle default bg
                      })
                    )}
                    title={subject} // Tooltip for full name on hover
                  >
                    {subject}
                  </motion.button>
                </motion.div>
              ))
            )}
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-2">

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Admin Login */}
            <Button
              variant="outline"
              onClick={() => router.push('/admin/login')}
              className="border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors duration-200 hidden sm:inline-flex"
            >
              Admin Login
            </Button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 md:hidden z-40"
              onClick={toggleMenu}
            />
            
            {/* Slide-in Menu - Fully opaque bg for max readability */}
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed right-0 top-0 h-full w-80 bg-white border-l shadow-2xl md:hidden z-50 flex flex-col p-6 rounded-l-lg" // Full bg-white + heavier shadow
            >
              {/* Close Button */}
              <div className="flex justify-end mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                  className="h-8 w-8 rounded-full hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Subjects List */}
              <div className="flex-1 flex flex-col gap-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">Subjects</h3> {/* Darker title */}
                {loading ? (
                  <div className="flex flex-col gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-12 bg-slate-200 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  subjects.map((subject, index) => (
                    <motion.button
                      key={subject}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      variants={subjectButtonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleSubjectSelect(subject)}
                      className={cn(
                        buttonVariants({ 
                          variant: "ghost", 
                          size: "lg",
                          className: "justify-start text-slate-800 hover:text-blue-600 hover:bg-blue-50/100 px-6 py-4 rounded-xl transition-all duration-200 font-medium text-base text-left break-words leading-relaxed shadow-sm hover:shadow-md bg-slate-50" // Subtle default bg-slate-50 for card-like visibility
                        })
                      )}
                    >
                      {subject}
                    </motion.button>
                  ))
                )}
              </div>

              {/* Divider & Admin Login */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push('/admin/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors duration-200 rounded-xl py-3 font-medium"
                >
                  Admin Login
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}