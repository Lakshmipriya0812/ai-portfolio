import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import ChatHeader from '../components/chat/ChatHeader';
import ResponseRenderer from '../components/chat/ResponseRenderer';
import ChatInput from '../components/chat/ChatInput';
import QuickQuestionButtons from '../components/QuickActions';
import HowToUseModal from '../components/HowToUseCardCarousal';

// Hooks
import { useChat } from '../hooks/useChat';

// Types
import { ChatProps } from '../types/chat';

// Constants
import { CHAT_ANIMATIONS } from '../constants/chat';

// Styles
import '../styles/chat.css';

const Chat: React.FC<ChatProps> = ({ onBackToHome, initialQuery }) => {
  const [showQuickQuestions] = useState(true);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const {
    currentInteraction,
    inputValue,
    setInputValue,
    isLoading,
    messagesEndRef,
    handleSendMessage,
    handleQuickQuestion,
    handleKeyPress
  } = useChat(initialQuery);

  return (
    <div className="chat-container">
      <div className="chat-content">

        {/* Header */}
        <ChatHeader onBackToHome={onBackToHome} />

        {/* Main Content */}
        <main className="chat-main">
          <div className="chat-content-wrapper">
            {/* Single Chat Interaction */}
            <AnimatePresence mode="wait">
              {currentInteraction && (
                <motion.div
                  key={currentInteraction.id}
                  {...CHAT_ANIMATIONS.container}
                  className="chat-interaction"
                >
                  {/* Question */}
                  <div className="question-container">
                    <p className="question-text">{currentInteraction.question}</p>
                  </div>

                  {/* Response */}
                  <ResponseRenderer interaction={currentInteraction} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Input Section */}
            <div className="chat-input-section">
              {/* Quick Questions */}
              <AnimatePresence>
                {showQuickQuestions && (
                  <motion.div
                    key="quick-questions"
                    {...CHAT_ANIMATIONS.quickQuestions}
                  >
                    <QuickQuestionButtons onQuestionClick={handleQuickQuestion} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Input */}
              <ChatInput
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSendMessage={handleSendMessage}
                onKeyPress={handleKeyPress}
                isLoading={isLoading}
              />
            </div>
          </div>
        </main>

        {/* How it works Modal */}
        <AnimatePresence>
          {isHowItWorksOpen && (
            <HowToUseModal 
              onModalStateChange={(isOpen: boolean) => setIsHowItWorksOpen(isOpen)} 
            />
          )}
        </AnimatePresence>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Chat;