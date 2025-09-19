import React from 'react';
import { motion } from 'framer-motion';
import AppleCardsCarousel from '../HowToUseCardCarousal';
import HeaderWidget from '../HeaderWidget';
import { HomeHeaderProps } from '../../types/home';

const HomeHeader: React.FC<HomeHeaderProps> = ({ showHeader, onModalStateChange }) => {
  const scaleFadeIn = (delay = 0.3) => ({
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { delay, duration: 0.5 },
  });

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="home-header"
    >
      {/* Apple Carousel */}
      <motion.div {...scaleFadeIn(0.3)}>
        <AppleCardsCarousel onModalStateChange={onModalStateChange} />
      </motion.div>

      {/* Social Header Widget */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <HeaderWidget />
      </motion.div>
    </motion.header>
  );
};

export default HomeHeader;
