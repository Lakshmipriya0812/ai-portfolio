import { useState } from "react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Chat from "./pages/Chat";

const AppContent = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'chat'>('landing');
  const [initialQuery, setInitialQuery] = useState<string>('');
  const { theme, toggleTheme } = useTheme();

  const handleSwitchToChat = (query?: string) => {
    setInitialQuery(query || '');
    setCurrentView('chat');
  };

  const handleSwitchToLanding = () => {
    setCurrentView('landing');
    setInitialQuery('');
  };

  return (
    <>
      {currentView === 'landing' ? (
        <Home onSwitchToChat={handleSwitchToChat} />
      ) : (
        <Chat 
          onBackToHome={handleSwitchToLanding} 
          theme={theme} 
          onThemeToggle={toggleTheme}
          initialQuery={initialQuery}
        />
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
