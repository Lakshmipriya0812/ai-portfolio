import React from "react";
import { AnimatePresence } from "framer-motion";
import HomeHeader from "../components/home/HomeHeader";
import HomeMain from "../components/home/HomeMain";
import HomeInput from "../components/home/HomeInput";
import QuickActions from "../components/QuickActions";
import { useHome } from "../hooks/useHome";
import { HomeProps } from "../types/home";

const Home: React.FC<HomeProps> = ({ onSwitchToChat }) => {
  const {
    inputValue,
    setInputValue,
    showHeader,
    setIsModalOpen,
    handleSendMessage,
    handleKeyPress,
    handleActionClick,
  } = useHome();

  const handleSend = () => handleSendMessage(onSwitchToChat);
  const handleKeyDown = (e: React.KeyboardEvent) =>
    handleKeyPress(e, onSwitchToChat);
  const handleAction = (question: string) =>
    handleActionClick(question, onSwitchToChat);

  return (
    <div
      className="home-container"
      style={{
        minHeight: "100vh",
        padding: 8,
        borderRadius: 12,
        background: "linear-gradient(135deg, #d8b4fe, #f9a8d4, #fca5a5)",
      }}
    >
      <div
        className="home-content"
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
        <AnimatePresence>
          {showHeader && (
            <HomeHeader
              showHeader={showHeader}
              onModalStateChange={setIsModalOpen}
            />
          )}
        </AnimatePresence>
        <HomeMain />
        {/* Input Section (chat-like) */}
        <HomeInput
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={handleSend}
          onKeyPress={handleKeyDown}
        />
        {/* Quick Actions (inline, like Chat) */}
        <div style={{ paddingTop: 8, paddingBottom: 8 }}>
          <QuickActions
            actions={undefined as any}
            onActionClick={handleAction}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
