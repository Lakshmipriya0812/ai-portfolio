import React from 'react';
import { AnimatePresence } from 'framer-motion';

import HomeHeader from '../components/home/HomeHeader';
import HomeMain from '../components/home/HomeMain';
import HomeInput from '../components/home/HomeInput';
import HomeBottomNav from '../components/home/HomeBottomNav';

// Hooks
import { useHome } from '../hooks/useHome';

// Types
import { HomeProps } from '../types/home';

// Styles
import '../styles/home.css';

const Home: React.FC<HomeProps> = ({ onSwitchToChat }) => {
  const {
    inputValue,
    setInputValue,
    showHeader,
    showBottomNav,
    isModalOpen,
    setIsModalOpen,
    handleSendMessage,
    handleKeyPress,
    handleActionClick
  } = useHome();

  const handleSend = () => handleSendMessage(onSwitchToChat);
  const handleKeyDown = (e: React.KeyboardEvent) => handleKeyPress(e, onSwitchToChat);
  const handleAction = (question: string) => handleActionClick(question, onSwitchToChat);

  return (
    <div className="home-container">
      <div className="home-content">


        {/* Header */}
        <AnimatePresence>
          {showHeader && (
            <HomeHeader 
              showHeader={showHeader}
              onModalStateChange={setIsModalOpen} 
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <HomeMain />

        {/* Input Section */}
        <HomeInput
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={handleSend}
          onKeyPress={handleKeyDown}
        />

        {/* Bottom Navigation */}
        <AnimatePresence>
          {showBottomNav && !isModalOpen && (
            <HomeBottomNav
              showBottomNav={showBottomNav}
              isModalOpen={isModalOpen}
              onActionClick={handleAction}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;