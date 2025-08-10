import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Info, 
  Star, 
  ChevronDown, 
  User, 
  Briefcase, 
  Brain, 
  Sparkles,
  MessageCircle, 
  MoreHorizontal,
  Send,
  Smile,
  Github,
  Linkedin,
  X,
  Loader2,
  ArrowRight,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { generateResponse } from '../services/portfolioData';

interface ChatInteraction {
  id: string;
  question: string;
  response: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatProps {
  onBackToHome: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const Chat = ({ onBackToHome }: ChatProps) => {
  const [currentInteraction, setCurrentInteraction] = useState<ChatInteraction | null>({
    id: '1',
    question: "Tell me about yourself",
    response: "Hey 👋 I'm Lakshmipriya, a passionate developer specializing in AI and full-stack development. I'm currently working on exciting projects and love exploring new technologies. I'm passionate about AI, tech, entrepreneurship and building innovative solutions.",
    timestamp: new Date()
  });
  const [inputValue, setInputValue] = useState('');
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentInteraction]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const question = inputValue;
    setInputValue('');
    setIsLoading(true);

    // Create new chat interaction with loading state
    const newInteraction: ChatInteraction = {
      id: Date.now().toString(),
      question: question,
      response: '',
      timestamp: new Date(),
      isLoading: true
    };

    // Replace the current interaction completely
    setCurrentInteraction(newInteraction);

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      const response = generateResponse(question);
      
      setCurrentInteraction({
        ...newInteraction,
        response,
        isLoading: false
      });
      
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    // Auto-send the question
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const quickActions = [
    { icon: Smile, label: "Me", action: () => handleQuickQuestion("Tell me about yourself") },
    { icon: Briefcase, label: "Projects", action: () => handleQuickQuestion("What projects have you worked on?") },
    { icon: Brain, label: "Skills", action: () => handleQuickQuestion("What are your technical skills?") },
    { icon: Briefcase, label: "Experience", action: () => handleQuickQuestion("What's your work experience?") },
    { icon: Sparkles, label: "Fun", action: () => handleQuickQuestion("What do you do for fun?") },
    { icon: MessageCircle, label: "Contact", action: () => handleQuickQuestion("How can I contact you?") }    
  ];

  return (
    <div className="min-h-screen p-[8px] rounded-xl bg-gradient-to-br from-purple-300 via-pink-300 to-red-300">
      <div className="bg-white backdrop-blur-sm min-h-full rounded-xl relative z-10">
        {/* Subtle Background Patterns */}
        <div className="fixed inset-0 pointer-events-none">
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

        {/* Header - Simplified with just LP logo */}
        <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-6">
          {/* Back Button */}
          <motion.button
            onClick={onBackToHome}
            className="flex items-center justify-center w-10 h-10 bg-gray-200 text-black-800 rounded-full border border-gray-300 hover:border-gray-600 hover:text-gray-900 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
          </motion.button>

          {/* LP Logo - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">LP</span>
            </div>
          </div>

          {/* How it works button */}
          <motion.button
            onClick={() => setIsHowItWorksOpen(true)}
            className="px-6 py-3 rounded-full bg-gray-200 text-black border border-gray-300 text-sm font-semibold shadow-lg hover:scale-105 transition-all duration-200"
          >
            How this works?
          </motion.button>
        </header>

        {/* Main Content */}
        <main className="pt-24 px-8 pb-8">
          <div className="max-w-4xl mx-auto">
            {/* Single Chat Interaction - Replaces entire content */}
            <AnimatePresence mode="wait">
              {currentInteraction && (
                <motion.div
                  key={currentInteraction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="min-h-[60vh] flex flex-col justify-center items-center"
                >
                  {/* Question - Only text, no user symbol */}
                  <div className="mb-8 text-center w-full">
                    <div className="mb-4">
                      <p className="text-gray-800 font-medium text-2xl">{currentInteraction.question}</p>
                    </div>
                  </div>

                  {/* Response or Loading */}
                  {currentInteraction.isLoading ? (
                    <motion.div 
                      className="text-center mb-8 w-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex justify-center mb-4">
                        <div className="loader"></div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="text-center mb-8 w-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="max-w-2xl mx-auto">
                        <p className="text-gray-800 leading-relaxed text-lg">{currentInteraction.response}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Input Section - Fixed at bottom */}
            <div className="mt-8">
              {/* Collapsible Quick Questions - Moved to middle with left arrow */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <motion.button 
                    onClick={() => setShowQuickQuestions(!showQuickQuestions)}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    
                    <span className="text-xs text-gray-600 font-medium ml-1">My quick questions</span>
                    <ArrowUp 
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        showQuickQuestions ? 'rotate-180' : ''
                      }`} 
                    />
                  </motion.button>
                </div>
                
                <AnimatePresence>
                  {showQuickQuestions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-3 justify-center pb-4">
                        {quickActions.map((action) => (
                          <motion.button
                            key={action.label}
                            onClick={action.action}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full text-sm transition-colors border border-gray-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <action.icon className="w-4 h-4" />
                            <span>{action.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Chat Input */}
              <motion.div 
                className="flex items-center space-x-3 bg-gray-50 rounded-full p-4 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500 text-sm"
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className={`p-2 rounded-full transition-colors ${
                    inputValue.trim() && !isLoading
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-200 text-gray-400'
                  } disabled:cursor-not-allowed`}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </main>

        {/* How it works Modal */}
        <AnimatePresence>
          {isHowItWorksOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto z-[10000] p-10"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsHowItWorksOpen(false)}
                  className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 hover:bg-gray-800 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-white" />
                </button>

                {/* Modal Content */}
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Welcome to AI Portfolio</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Hover Effect Box */}
                    <div className="group relative bg-gray-100 p-8 rounded-lg overflow-hidden shadow-md cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-pink-300 opacity-0 group-hover:opacity-30 transition duration-300" />
                      <h3 className="text-2xl font-extrabold text-gray-800 mb-6 relative z-10">How to Use</h3>
                      <p className="text-gray-700 text-base leading-relaxed relative z-10">
                        Enter your questions directly into the chat interface. Utilize quick-action buttons for faster navigation. Explore details about my background, technical skills, or personal interests.
                      </p>
                    </div>

                    {/* Why I created this Box */}
                    <div className="group relative bg-gray-100 p-8 rounded-lg overflow-hidden shadow-md cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-blue-300 opacity-0 group-hover:opacity-30 transition duration-300" />
                      <h3 className="text-2xl font-extrabold text-gray-800 mb-4 z-10 relative">Why I created this</h3>
                      <p className="text-gray-700 z-10 relative text-base leading-relaxed">
                        Most portfolios are static and impersonal. This one is interactive — it adapts to your questions and lets you explore in real time.
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-center mt-8">
                    <motion.button
                      onClick={() => setIsHowItWorksOpen(false)}
                      className="px-6 py-3 rounded-full bg-gray-200 text-black border border-gray-300 text-sm font-semibold shadow-lg hover:scale-105 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Chatting
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* CSS Loader Styles */}
        <style>{`
          .loader {
            height: 9px;
            width: 60px;
            --c:no-repeat linear-gradient(#000 0 0);
            background: var(--c), var(--c), var(--c), var(--c);
            background-size: 26% 3px;
            animation: l1 1s infinite;
          }
          @keyframes l1 {
            0%,
            70%,
            100%   {background-position: calc(0*100%/3) 50% ,calc(1*100%/3) 50% ,calc(2*100%/3) 50% ,calc(3*100%/3) 50% }
            11.67% {background-position: calc(0*100%/3) 0   ,calc(1*100%/3) 50% ,calc(2*100%/3) 50% ,calc(3*100%/3) 50% }
            23.33% {background-position: calc(0*100%/3) 100%,calc(1*100%/3) 0   ,calc(2*100%/3) 50% ,calc(3*100%/3) 50% }
            35%    {background-position: calc(0*100%/3) 50% ,calc(1*100%/3) 100%,calc(2*100%/3) 0   ,calc(3*100%/3) 50% }
            46.67% {background-position: calc(0*100%/3) 50% ,calc(1*100%/3) 50% ,calc(2*100%/3) 100%,calc(3*100%/3) 0   }
            58.34% {background-position: calc(0*100%/3) 50% ,calc(1*100%/3) 50% ,calc(2*100%/3) 50% ,calc(3*100%/3) 100%}
          }
        `}</style>
      </div>
    </div>
  );
};

export default Chat; 