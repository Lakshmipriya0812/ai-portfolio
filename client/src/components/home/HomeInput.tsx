import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { HomeInputProps } from '../../types/home';

const HomeInput: React.FC<HomeInputProps> = ({
  inputValue,
  onInputChange,
  onSendMessage,
  onKeyPress
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="home-input-section"
    >
      <div className="home-input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyPress}
          placeholder="Ask me anything..."
          className='home-input'
          id="question-input" 
          name="question"
        />
        <motion.button
          onClick={onSendMessage}
          className="home-send-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowRight size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HomeInput;
