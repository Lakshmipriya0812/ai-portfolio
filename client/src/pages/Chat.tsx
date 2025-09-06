import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';
import { 
  ArrowLeft,
  ArrowUp,
  Send
} from 'lucide-react';
import { apiService } from '../services/apiService';
import HowToUseModal from '../components/HowToUseCardCarousal';
import QuickQuestionButtons from '../components/QuickActions';
import HeaderWidget from '../components/HeaderWidget';

interface ChatInteraction {
  id: string;
  question: string;
  response: string;
  timestamp: Date;
  isLoading?: boolean;
  structured?: any;
}

interface ChatProps {
  onBackToHome: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const Chat = ({ onBackToHome }: ChatProps) => {
  const [currentInteraction, setCurrentInteraction] = useState<ChatInteraction | null>(null);
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

  const handleSendMessage = useCallback(async (message?: string) => {
    const question = message ?? inputValue;
    if (!question.trim()) return;
  
    setInputValue('');
    setIsLoading(true);
  
    const newInteraction: ChatInteraction = {
      id: Date.now().toString(),
      question,
      response: '',
      timestamp: new Date(),
      isLoading: true
    };
  
    setCurrentInteraction(newInteraction);
  
    try {
      const response = await apiService.sendChatMessage(question);
      const aiResponse = response.response.content;
      const structured = response.response.data?.structured;
  
      setCurrentInteraction({
        ...newInteraction,
        response: aiResponse,
        structured,
        isLoading: false
      });
    } catch (err: any) {
      setCurrentInteraction({
        ...newInteraction,
        response: err?.message || 'Something went wrong. Please try again.',
        structured: undefined,
        isLoading: false
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputValue]);
  

  const debouncedSend = useRef(
    debounce((msg: string) => {
      handleSendMessage(msg);
    }, 300)
  ).current;
  
  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    debouncedSend(question);
  };
  

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(); 
    }
  };
  
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
        <header className="absolute top-0 left-0 right-0 z-30">
          <div className="flex items-center justify-between px-6 py-4 relative">
            
            {/* Back Button */}
            <motion.button
              onClick={onBackToHome}
              className="flex items-center justify-center w-10 h-10 bg-gray-200 text-black-800 rounded-full border border-gray-300 hover:border-gray-600 hover:text-gray-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
            </motion.button>

            {/* LP Logo - Centered Absolutely within Relative Container */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">LP</span>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <HeaderWidget />
            </div>
          </div>
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
                  {/* Question */}
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
                        {currentInteraction.structured
                          ? renderStructured(currentInteraction.structured)
                          : (<p className="text-gray-800 leading-relaxed text-lg">{currentInteraction.response}</p>)}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Input Section - Fixed at bottom */}
            <div className="mt-8">
              {/* Collapsible Quick Questions - Moved to middle with left arrow */}
                <AnimatePresence>
                  {showQuickQuestions && (
                    <motion.div
                      key="quick-questions"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <QuickQuestionButtons onQuestionClick={handleQuickQuestion} />
                    </motion.div>
                  )}
                </AnimatePresence>


              {/* Chat Input */}
              <motion.div 
                className="flex items-center space-x-3 bg-gray-50 rounded-full p-4 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={1}
                  className="resize-none w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 text-sm"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSendMessage()}
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
        <HowToUseModal onModalStateChange={(isOpen: boolean) => setIsHowItWorksOpen(isOpen)} />)}

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

// Renderer for structured chat responses from the backend
function renderStructured(structured: any) {
  const type = structured?.type;
  switch (type) {
    case 'project':
    case 'skills':
      return (
        <div className="text-left">
          <h3 className="text-2xl font-semibold mb-3">🛠 Technical Skills</h3>
          <div className="flex flex-wrap gap-2">
            {(structured.skills || []).map((s: string) => (
              <span key={s} className="px-2 py-1 text-sm rounded-full bg-blue-50 text-blue-700 border border-blue-200">{s}</span>
            ))}
          </div>
        </div>
      );
    case 'skill':
      return (
        <div className="text-left">
          <h3 className="text-2xl font-semibold mb-2">🛠 Skill</h3>
          <span className="px-2 py-1 text-sm rounded-full bg-blue-50 text-blue-700 border border-blue-200">{structured.name}</span>
        </div>
      );
    case 'contact':
      return (
        <div className="text-left space-y-2">
          <h3 className="text-2xl font-semibold">📬 Contact</h3>
          {structured.email && (<p>✉️ <a className="text-blue-600 hover:underline" href={`mailto:${structured.email}`}>{structured.email}</a></p>)}
          {structured.phone && (<p>📞 <a className="text-blue-600 hover:underline" href={`tel:${structured.phone}`}>{structured.phone}</a></p>)}
          {structured.linkedin && (<p>🔗 <a className="text-blue-600 hover:underline" href={structured.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></p>)}
          {structured.github && (<p>🐙 <a className="text-blue-600 hover:underline" href={structured.github} target="_blank" rel="noreferrer">GitHub</a></p>)}
        </div>
      );
    case 'experience':
      return (
        <div className="text-left">
          <h3 className="text-2xl font-semibold mb-1">💼 {structured.role}{structured.company ? ` @ ${structured.company}` : ''}</h3>
          {structured.period && (<p className="text-gray-600 mb-3">{structured.period}</p>)}
          {structured.highlights?.length > 0 && (
            <ul className="list-disc pl-6 space-y-1 text-gray-800">
              {structured.highlights.map((h: string, idx: number) => (
                <li key={idx}>{h}</li>
              ))}
            </ul>
          )}
        </div>
      );
    case 'education':
      return (
        <div className="text-left">
          <h3 className="text-2xl font-semibold mb-1">🎓 {structured.institution}</h3>
          <p className="text-gray-700 mb-1">{[structured.degree, structured.field].filter(Boolean).join(', ')}</p>
          {structured.period && (<p className="text-gray-600">{structured.period}</p>)}
        </div>
      );
    default:
      return (<p className="text-gray-800 leading-relaxed text-lg">{structured?.text || ''}</p>);
  }
}