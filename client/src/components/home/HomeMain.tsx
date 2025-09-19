import React from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';

const HomeMain: React.FC = () => {
  return (
    <main className="home-main">
      <div className="home-content-wrapper">
        {/* Name Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="name-section"
        >
          <p className="name-text">
            <span className="name-greeting">
              <Typewriter
                words={[
                  "👋 Hi,",
                  "👋 வணக்கம்,",
                  "👋 नमस्ते,",
                  "👋 Bonjour,",
                  "👋 Hallo,"
                ]}
                loop={true}
                cursor={false}
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </span>
            I'm Lakshmipriya
          </p>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="home-title"
        >
          AI Portfolio
        </motion.h1>

        {/* 3D Avatar */}
        <motion.div
          className="home-avatar"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="avatar-circle">
            <div className="avatar-emoji">👩‍💻</div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default HomeMain;
