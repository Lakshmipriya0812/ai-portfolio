import { useState } from "react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Chat from "./pages/Chat";

const AppContent = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'chat'>('landing');
  const { theme, toggleTheme } = useTheme();

  const handleSwitchToChat = () => {
    setCurrentView('chat');
  };

  const handleSwitchToLanding = () => {
    setCurrentView('landing');
  };

  return (
    <>
      {currentView === 'landing' ? (
        <Home onSwitchToChat={handleSwitchToChat} />
      ) : (
        <Chat onBackToHome={handleSwitchToLanding} theme={theme} onThemeToggle={toggleTheme} />
      )}
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
