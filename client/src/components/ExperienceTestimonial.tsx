"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";

type ExperienceItem = {
  role?: string;
  company?: string;
  period?: string;
  highlights?: string[];
};

type ExperienceTestimonialProps = {
  experiences: ExperienceItem[];
  autoplay?: boolean;
};

export const ExperienceTestimonial = ({
  experiences,
}: ExperienceTestimonialProps) => {
  const [active, setActive] = useState(0);

  const testimonials = experiences.map((exp) => ({
    name: exp.role || "Unknown Role",
    designation: `${exp.company || "Unknown Company"} • ${exp.period || "Unknown Period"}`,
    highlights: exp.highlights || [],
  }));

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="mx-auto max-w-4xl px-12 py-20 font-sans antialiased bg-gradient-to-r from-gray-800 to-black rounded-3xl shadow-lg text-white">
      <h3 className="text-3xl font-bold mb-12 text-center">Experience</h3>

      {/* Text Content */}
      <div className="flex flex-col justify-between py-4 w-full max-w-[700px] mx-auto">
        <motion.div
          key={active}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <h3 className="text-3xl font-semibold mb-2">{testimonials[active].name}</h3>
          <p className="text-md text-gray-300 mb-6">
            {testimonials[active].designation}
          </p>
          <motion.ul className="list-disc list-inside text-lg text-gray-200 leading-relaxed space-y-2">
            {testimonials[active].highlights.map((point, i) => (
              <motion.li
                key={i}
                initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  ease: "easeInOut",
                  delay: 0.15 * i,
                }}
                className="ml-2"
              >
                {point}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Navigation Arrows */}
        <div className="flex gap-6 pt-12 justify-center">
          <button
            onClick={handlePrev}
            className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition"
            aria-label="Previous Experience"
          >
            <motion.div
              whileHover={{
                rotate: [0, -15, 15, -10, 10, 0],
                transition: { duration: 0.6 },
              }}
            >
              <IconArrowLeft className="h-6 w-6 text-white" />
            </motion.div>

          </button>
          <button
            onClick={handleNext}
            className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition"
            aria-label="Next Experience"
          >
            <motion.div
              whileHover={{
                rotate: [0, 15, -15, 10, -10, 0],
                transition: { duration: 0.6 },
              }}
            >
              <IconArrowRight className="h-6 w-6 text-white" />
            </motion.div>

          </button>
        </div>
      </div>
    </div>
  );
};
