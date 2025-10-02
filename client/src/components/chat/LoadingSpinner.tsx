import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <motion.div 
      className="response-container"
      style={{ textAlign: 'center', marginBottom: 32, width: '100%' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <style>{`
        @keyframes loader-animation {
          0%, 70%, 100% {
            background-position: calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 50%, calc(2 * 100% / 3) 50%, calc(3 * 100% / 3) 50%;
          }
          11.67% {
            background-position: calc(0 * 100% / 3) 0, calc(1 * 100% / 3) 50%, calc(2 * 100% / 3) 50%, calc(3 * 100% / 3) 50%;
          }
          23.33% {
            background-position: calc(0 * 100% / 3) 100%, calc(1 * 100% / 3) 0, calc(2 * 100% / 3) 50%, calc(3 * 100% / 3) 50%;
          }
          35% {
            background-position: calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 100%, calc(2 * 100% / 3) 0, calc(3 * 100% / 3) 50%;
          }
          46.67% {
            background-position: calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 50%, calc(2 * 100% / 3) 100%, calc(3 * 100% / 3) 0;
          }
          58.34% {
            background-position: calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 50%, calc(2 * 100% / 3) 50%, calc(3 * 100% / 3) 100%;
          }
        }
      `}</style>
      <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <div
          className="loader"
          style={{
            height: 9,
            width: 60,
            background: 'no-repeat linear-gradient(#000 0 0), no-repeat linear-gradient(#000 0 0), no-repeat linear-gradient(#000 0 0), no-repeat linear-gradient(#000 0 0)',
            backgroundSize: '26% 3px',
            animation: 'loader-animation 1s infinite'
          }}
        />
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;
