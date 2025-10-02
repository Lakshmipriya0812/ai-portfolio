"use client";

import React from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

const HomeMain: React.FC = () => {
  return (
    <main className="home-main relative flex items-center justify-center min-h-[70vh] px-4 md:px-8 ">
      {/* Content Wrapper */}
      <div className="home-content-wrapper flex flex-col md:flex-row items-center gap-8 md:gap-16 max-w-6xl mx-auto text-center md:text-left">
        {/* Avatar Section */}
        <motion.div
          className="home-avatar rounded-full overflow-hidden shadow-lg"
          style={{ width: 220, height: 220 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
        >
          <img
            src="/Formal pic.jpg"
            alt="Formal Avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>

        {/* Text Section */}
        <div className="text-section max-w-lg">
          {/* Greeting / Name */}
          <motion.p
            className="text-2xl md:text-3xl font-semibold mb-2 text-gray-800 dark:text-black-100 flex items-center justify-center md:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="mr-2">
              <Typewriter
                words={["👋 Hi,", "👋 Bonjour,", "👋 Hallo,"]}
                loop
                cursor={false}
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </span>
            I'm Lakshmipriya
          </motion.p>

          {/* Portfolio Title */}
          <motion.h1
            className="home-title text-4xl md:text-6xl font-extrabold mb-4 text-gray-800 dark:text-black-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            AI Portfolio
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-gray-600 dark:text-gray-800 text-lg md:text-xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Crafting intelligent web experiences & AI-powered dashboards.
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div
            className="flex gap-4 justify-center md:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a
              href="/Lakshmipriya.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 border-2 border-gray-800 text-gray-800 font-semibold rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            >
              Download Resume
            </a>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default HomeMain;
