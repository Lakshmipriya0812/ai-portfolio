import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatHeader from "../components/chat/ChatHeader";
import ResponseRenderer from "../components/chat/ResponseRenderer";
import ChatInput from "../components/chat/ChatInput";
import QuickQuestionButtons from "../components/QuickActions";
import HowToUseModal from "../components/HowToUseCardCarousal";
import { useChat } from "../hooks/useChat";
import { ChatProps } from "../types/chat";
import { CHAT_ANIMATIONS } from "../constants/chat";

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
    handleKeyPress,
  } = useChat(initialQuery);

  return (
    <div
      className="chat-container"
      style={{
        minHeight: "100vh",
        padding: 8,
        borderRadius: 12,
        background: "linear-gradient(135deg, #d8b4fe, #f9a8d4, #fca5a5)",
      }}
    >
      <div
        className="chat-content"
        style={{
          backgroundColor: "white",
          backdropFilter: "blur(8px)",
          minHeight: "100%",
          borderRadius: 12,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Header */}
        <ChatHeader onBackToHome={onBackToHome} />

        {/* Main Content */}
        <main
          className="chat-main"
          style={{
            paddingTop: 96,
            paddingLeft: 32,
            paddingRight: 32,
            paddingBottom: 32,
          }}
        >
          <div
            className="chat-content-wrapper"
            style={{ maxWidth: "64rem", margin: "0 auto" }}
          >
            {/* Single Chat Interaction */}
            <AnimatePresence mode="wait">
              {currentInteraction && (
                <motion.div
                  key={currentInteraction.id}
                  {...CHAT_ANIMATIONS.container}
                  className="chat-interaction"
                  style={{
                    minHeight: "60vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* Question */}
                  <div
                    className="question-container"
                    style={{
                      marginBottom: 32,
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    <p
                      className="question-text"
                      style={{
                        color: "#1f2937",
                        fontWeight: 500,
                        fontSize: 24,
                      }}
                    >
                      {currentInteraction.question}
                    </p>
                  </div>

                  {/* Response */}
                  <ResponseRenderer interaction={currentInteraction} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Input Section */}
            <div className="chat-input-section" style={{ marginTop: 32 }}>
              {/* Quick Questions */}
              <AnimatePresence>
                {showQuickQuestions && (
                  <motion.div
                    key="quick-questions"
                    {...CHAT_ANIMATIONS.quickQuestions}
                  >
                    <QuickQuestionButtons
                      onQuestionClick={handleQuickQuestion}
                    />
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

        <AnimatePresence>
          {isHowItWorksOpen && (
            <HowToUseModal
              onModalStateChange={(isOpen: boolean) =>
                setIsHowItWorksOpen(isOpen)
              }
            />
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Chat;
