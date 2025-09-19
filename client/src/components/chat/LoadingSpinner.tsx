import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <motion.div 
      className="response-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;
