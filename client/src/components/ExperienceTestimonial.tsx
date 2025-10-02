"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";

type ExperienceItem = {
  role?: string;
  company?: string;
  period?: string;
  highlights?: string[];
  aiText?: string;
};

type ExperienceTestimonialProps = {
  experiences: ExperienceItem[];
};

export const ExperienceTestimonial = ({
  experiences,
}: ExperienceTestimonialProps) => {
  const [active, setActive] = useState(0);

  const testimonials = experiences.map((exp) => ({
    name: exp.role || "Unknown Role",
    designation: `${exp.company || "Unknown Company"} • ${
      exp.period || "Unknown Period"
    }`,
    highlights: exp.highlights || [],
    aiText: exp.aiText || "",
  }));

  const handleNext = () =>
    setActive((prev) => (prev + 1) % testimonials.length);
  const handlePrev = () =>
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[active];

  const cleanLine = (line: string) => {
    return line
      .replace(/[*_~`]/g, "")
      .replace(/^\d+\.\s*/, "")
      .replace(/\|/g, "")
      .trim();
  };

  return (
    <div className="mx-auto max-w-4xl px-10 py-12 font-sans antialiased bg-gradient-to-r from-gray-800 to-black rounded-3xl shadow-lg text-white">
      <h3 className="text-3xl font-bold mb-8 text-center">Experience</h3>

      <div className="flex flex-col justify-between py-2 w-full max-w-[800px] mx-auto">
        <motion.div
          key={active}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Role & Company */}
          <h3 className="text-2xl font-semibold mb-1">{current.name}</h3>
          <p className="text-md text-gray-300 mb-4">{current.designation}</p>

          {/* AI Insights */}
          {current.aiText ? (
            <motion.div
              className="space-y-2 text-lg text-gray-200 leading-snug"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h4 className="text-xl font-semibold mb-2">
                Professional Highlights
              </h4>
              {current.aiText
                .split("\n")
                .filter((line) => line.trim() !== "")
                .map((line, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mt-2"></span>
                    <p>{cleanLine(line)}</p>
                  </div>
                ))}
            </motion.div>
          ) : (
            <p className="text-gray-400 italic">
              No Key Contributions available.
            </p>
          )}
        </motion.div>

        {/* Navigation */}
        {testimonials.length > 1 && (
          <div className="flex gap-4 pt-8 justify-center">
            <button
              onClick={handlePrev}
              className="group/button flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition"
              aria-label="Previous Experience"
            >
              <motion.div
                whileHover={{
                  rotate: [0, -15, 15, -10, 10, 0],
                  transition: { duration: 0.6 },
                }}
              >
                <IconArrowLeft className="h-5 w-5 text-white" />
              </motion.div>
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition"
              aria-label="Next Experience"
            >
              <motion.div
                whileHover={{
                  rotate: [0, 15, -15, 10, -10, 0],
                  transition: { duration: 0.6 },
                }}
              >
                <IconArrowRight className="h-5 w-5 text-white" />
              </motion.div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
