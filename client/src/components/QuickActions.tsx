// components/QuickQuestionButtons.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smile, Briefcase, Brain, Sparkles, MessageCircle, ArrowUp 
} from 'lucide-react';
import { useState } from 'react';

interface QuickQuestionButtonsProps {
  onQuestionClick: (question: string) => void;
}

const QuickQuestionButtons = ({ onQuestionClick }: QuickQuestionButtonsProps) => {
  const [expanded, setExpanded] = useState(true);

  const quickActions = [
    { icon: Smile, label: "Me", question: "Tell me about yourself" },
    { icon: Briefcase, label: "Projects", question: "What projects have you worked on?" },
    { icon: Brain, label: "Skills", question: "What are your technical skills?" },
    { icon: Briefcase, label: "Experience", question: "What's your work experience?" },
    { icon: Sparkles, label: "Fun", question: "What do you do for fun?" },
    { icon: MessageCircle, label: "Contact", question: "How can I contact you?" }
  ];

  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Toggle button */}
      <div className="flex items-center justify-center mb-4">
        <motion.button 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-xs text-gray-600 font-medium ml-1">My quick questions</span>
          <ArrowUp 
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              expanded ? 'rotate-180' : ''
            }`} 
          />
        </motion.button>
      </div>

      {/* Buttons */}
      <AnimatePresence>
        {expanded && (
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
                  onClick={() => onQuestionClick(action.question)}
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
  );
};

export default QuickQuestionButtons;
