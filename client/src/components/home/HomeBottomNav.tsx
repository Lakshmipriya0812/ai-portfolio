import React from "react";
import { motion } from "framer-motion";
import QuickActions from "../../components/QuickActions";
import { QUICK_ACTIONS } from "../../constants/home";
import { HomeBottomNavProps } from "../../types/home";

const HomeBottomNav: React.FC<HomeBottomNavProps> = ({ onActionClick }) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="home-bottom-nav"
      style={{
        position: "static",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 25,
        marginTop: 16,
      }}
    >
      <div className="bottom-nav-content" style={{ padding: "24px 32px 32px" }}>
        <div style={{ maxWidth: "32rem", margin: "0 auto" }}>
          <QuickActions
            actions={QUICK_ACTIONS as any}
            onActionClick={onActionClick}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default HomeBottomNav;
