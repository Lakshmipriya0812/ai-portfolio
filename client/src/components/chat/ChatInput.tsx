import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { ChatInputProps } from '../../types/chat';
import { CHAT_CONFIG } from '../../constants/chat';

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  onInputChange,
  onSendMessage,
  onKeyPress,
  isLoading
}) => {
  const isDisabled = !inputValue.trim() || isLoading;

  return (
    <motion.div 
      className="chat-input-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <textarea
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyPress}
        rows={1}
        className="chat-textarea"
        placeholder={CHAT_CONFIG.placeholder}
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSendMessage}
        disabled={isDisabled}
        className={`send-button ${
          isDisabled ? 'send-button-disabled' : 'send-button-enabled'
        }`}
      >
        <Send className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

export default ChatInput;
