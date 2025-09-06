import { motion } from 'framer-motion';

interface QuickActionsProps {
  onQuestionClick: (question: string) => void;
  theme: 'light' | 'dark';
}

const QuickActions = ({ onQuestionClick, theme }: QuickActionsProps) => {
  const questions = [
    "Tell me about yourself",
    "Tell me about your projects",
    "What are your skills?",
    "What's your experience?",
    "What do you do for fun?",
    "How can I contact you?"
  ];

  return (
    <div className="mb-6">
      <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        Quick questions:
      </p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <motion.button
            key={index}
            onClick={() => onQuestionClick(question)}
            className={`px-3 py-2 rounded-full text-xs ${
              theme === 'dark' 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {question}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions; 