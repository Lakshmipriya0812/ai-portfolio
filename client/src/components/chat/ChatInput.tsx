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
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#f9fafb',
        borderRadius: 50,
        padding: '8px 12px',
        border: '1px solid #e5e7eb',
        maxWidth: '100%',
        width: '80%',
        margin: '0 auto'
      }}
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
        style={{
          resize: 'none',
          width: '100%',
          background: 'transparent',
          outline: 'none',
          color: '#1f2937',
          fontSize: 14
        }}
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
        style={{
          padding: 8,
          borderRadius: '50%',
          transition: 'all 0.2s ease',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          backgroundColor: isDisabled ? '#e5e7eb' : '#3b82f6',
          color: isDisabled ? '#9ca3af' : '#ffffff'
        }}
      >
        <Send className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

export default ChatInput;
