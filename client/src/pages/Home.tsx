import { Github, Linkedin, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import AppleCardsCarousel from "../components/HowToUseCardCarousal";

interface HomeProps {
  onSwitchToChat: () => void;
  isModalOpen?: boolean;
}

const Home = ({ onSwitchToChat }: HomeProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showHeader, setShowHeader] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Show header after 1 second
    const headerTimer = setTimeout(() => setShowHeader(true), 1000);
    // Show bottom nav after 1.5 seconds
    const navTimer = setTimeout(() => setShowBottomNav(true), 1500);
    
    return () => {
      clearTimeout(headerTimer);
      clearTimeout(navTimer);
    };
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSwitchToChat();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { 
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3E9858" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ), 
      label: "Me", 
      action: () => onSwitchToChat() 
    },
    { 
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3E9858" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 12h.01"/>
          <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          <path d="M22 13a18.15 18.15 0 0 1-20 0"/>
          <rect width="20" height="14" x="2" y="6" rx="2"/>
        </svg>
      ), 
      label: "Projects", 
      action: () => onSwitchToChat() 
    },
    { 
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3E9858" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          <path d="m12 12-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        </svg>
      ), 
      label: "Skills", 
      action: () => onSwitchToChat() 
    },
          { 
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3E9858" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        ),
        label: "Experience",
        action: () => onSwitchToChat()
      },
    { 
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3E9858" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12l2 2 4-4"/>
          <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2"/>
          <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2"/>
          <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2"/>
          <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2"/>
        </svg>
      ), 
      label: "Fun", 
      action: () => onSwitchToChat() 
    },
    { 
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3E9858" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ), 
      label: "Contact", 
      action: () => onSwitchToChat() 
    }
  ];

      
  return (
      <div
      className="min-h-screen p-[8px] rounded-xl bg-gradient-to-br from-purple-300 via-pink-300 to-red-300"
    >
  
    <div className="bg-white backdrop-blur-sm min-h-full rounded-xl relative z-10">
      {/* Subtle Background Patterns */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Simple circular patterns */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gray-100 rounded-full opacity-20"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gray-100 rounded-full opacity-15"></div>
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-gray-100 rounded-full opacity-20"></div>
        
        {/* Large background letters */}
        <div className="absolute bottom-20 left-10 text-gray-50 text-9xl font-bold opacity-3 select-none">
          L
        </div>
        <div className="absolute bottom-20 right-10 text-gray-50 text-9xl font-bold opacity-3 select-none">
          M
        </div>
      </div>

      {/* Header - Slides down from top */}
      <AnimatePresence>
        {showHeader && (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-6"
          >
            {/* Availability Button */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <AppleCardsCarousel onModalStateChange={setIsModalOpen} />
            </motion.div>



            {/* Social Links */}
            <div className="flex items-center space-x-3">
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center justify-center w-10 h-10 bg-gray-200 text-black-800 rounded-full border border-gray-300 hover:border-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => window.open('https://github.com/Lakshmipriya0812', '_blank')}
              aria-label="GitHub"
            >
              <Github size={20} />
            </motion.button>

            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex items-center justify-center w-10 h-10 bg-gray-200 text-black-800 rounded-full border border-gray-300 hover:border-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => window.open('https://www.linkedin.com/in/lakshmipriya-r/', '_blank')}
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </motion.button>
          </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Content - Centered with wider layout */}
      <main className="flex items-center justify-center min-h-screen px-8">
        <div className="text-center w-full max-w-6xl mx-auto">
          {/* Name Section - Above AI Portfolio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              <span className="inline-block mr-2">
                <Typewriter
                  words={[
                    "👋 Hi,",
                    "👋 வணக்கம்,",
                    "👋 नमस्ते,",
                    "👋 Bonjour,",
                    "👋 Hallo,"
                  ]}
                  loop={true}
                  cursor={false}
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1500}
                />
              </span>
              I'm Lakshmipriya
            </p>
          </motion.div>


          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
          >
            AI Portfolio
          </motion.h1>

          {/* 3D Avatar */}
          <motion.div
            className="w-40 h-40 md:w-56 md:h-56 mx-auto mb-8 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {/* Modern 3D Avatar */}
            <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-white text-5xl md:text-7xl">👩‍💻</div>
            </div>
          </motion.div>

          {/* Chat Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="w-full px-8 py-5 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-20 transition-all shadow-sm text-lg"
              />
              <motion.button
                onClick={handleSendMessage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Bottom Navigation - Slides up from bottom */}
      <AnimatePresence>
        {showBottomNav && !isModalOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 z-30"
          >
            <div className="px-8 pb-12">
              <div className="flex justify-center space-x-6 max-w-2xl mx-auto">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    onClick={action.action}
                    className="flex flex-col items-center space-y-2 px-6 py-4 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  >
                    {action.icon}
                    <span className="text-sm text-gray-600 font-medium">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>

  );
};

export default Home;