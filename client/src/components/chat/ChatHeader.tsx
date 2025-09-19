import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import HeaderWidget from '../HeaderWidget';
import { ChatHeaderProps } from '../../types/chat';

const ChatHeader: React.FC<ChatHeaderProps> = ({ onBackToHome }) => {
  return (
    <header className="chat-header">
      <div className="header-content">
        {/* Back Button */}
        <motion.button
          onClick={onBackToHome}
          className="back-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
        </motion.button>

        {/* LP Logo - Centered */}
        <div className="logo-container">
          <div className="logo">
            <span className="logo-text">LP</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <HeaderWidget />
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
