import React from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Star, Layers, Sparkles, MessageCircle } from 'lucide-react';
import { QUICK_ACTIONS } from '../../constants/home';
import { HomeBottomNavProps, QuickAction } from '../../types/home';

const iconMap = {
  user: User,
  briefcase: Briefcase,
  star: Star,
  layers: Layers,
  sparkles: Sparkles,
  'message-circle': MessageCircle,
} as const;

const HomeBottomNav: React.FC<HomeBottomNavProps> = ({
  showBottomNav,
  isModalOpen,
  onActionClick
}) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="home-bottom-nav"
    >
      <div className="bottom-nav-content">
        <div className="bottom-nav-grid">
          {QUICK_ACTIONS.map((action: QuickAction, index: number) => {
            const IconComponent = iconMap[action.icon as keyof typeof iconMap];
            return (
              <motion.button
                key={action.label}
                onClick={() => onActionClick(action.question)}
                className="bottom-nav-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              >
                <IconComponent className="bottom-nav-icon" />
                <span className="bottom-nav-label">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default HomeBottomNav;
