import { useState, useEffect } from 'react';

export const useHome = () => {
  const [inputValue, setInputValue] = useState('');
  const [showHeader, setShowHeader] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const headerTimer = setTimeout(() => setShowHeader(true), 1000);
    const navTimer = setTimeout(() => setShowBottomNav(true), 1500);
    
    return () => {
      clearTimeout(headerTimer);
      clearTimeout(navTimer);
    };
  }, []);

  const handleSendMessage = (onSwitchToChat: (query?: string) => void) => {
    if (inputValue.trim()) {
      onSwitchToChat(inputValue.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, onSwitchToChat: (query?: string) => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(onSwitchToChat);
    }
  };

  const handleActionClick = (question: string, onSwitchToChat: (query?: string) => void) => {
    onSwitchToChat(question);
  };

  return {
    inputValue,
    setInputValue,
    showHeader,
    showBottomNav,
    isModalOpen,
    setIsModalOpen,
    handleSendMessage,
    handleKeyPress,
    handleActionClick
  };
};
