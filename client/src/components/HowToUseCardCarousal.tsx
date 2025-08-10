'use client';

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface HowToUseModalProps {
  onModalStateChange?: (isOpen: boolean) => void;
}

export default function HowToUseModal({ onModalStateChange }: HowToUseModalProps) {
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    onModalStateChange?.(open);
  }, [open, onModalStateChange]);

  return (
    <>
    <motion.button
      onClick={() => setOpen(true)}
      className="px-6 py-3 rounded-full bg-gray-200 text-black border border-gray-300 text-sm font-semibold shadow-lg hover:scale-105 transition-all duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      How this works?
    </motion.button>


      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            />

            {/* Modal */}
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto z-[10000] p-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Content */}
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Welcome to AI Portfolio</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Hover Effect Box */}
            <div className="group relative bg-gray-100 p-8 rounded-lg overflow-hidden shadow-md cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-pink-300 opacity-0 group-hover:opacity-30 transition duration-300" />
            <h3 className="text-2xl font-extrabold text-gray-800 mb-6 relative z-10">How to Use</h3>
            <p className="text-gray-700 text-base leading-relaxed relative z-10">
                Enter your questions directly into the chat interface. Utilize quick-action buttons for faster navigation. Explore details about my background, technical skills, or personal interests.
            </p>
            </div>



            {/* Why I created this Box */}
            <div className="group relative bg-gray-100 p-8 rounded-lg overflow-hidden shadow-md cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-blue-300 opacity-0 group-hover:opacity-30 transition duration-300" />
                <h3 className="text-2xl font-extrabold text-gray-800 mb-4 z-10 relative">Why I created this</h3>
                <p className="text-gray-700 z-10 relative text-base leading-relaxed">
                Most portfolios are static and impersonal. This one is interactive — it adapts to your questions and lets you explore in real time.
                </p>
            </div>
            </div>



            {/* Footer */}
            <div className="flex justify-center mt-8">
              <motion.button
                onClick={() => setOpen(false)}
                className="px-6 py-3 rounded-full bg-gray-200 text-black border border-gray-300 text-sm font-semibold shadow-lg hover:scale-105 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Chatting
              </motion.button>
            </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
