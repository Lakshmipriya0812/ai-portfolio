import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import HeaderWidget from "../HeaderWidget";
import { ChatHeaderProps } from "../../types/chat";

const ChatHeader: React.FC<ChatHeaderProps> = ({ onBackToHome }) => {
  return (
    <header
      className="chat-header"
      style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 30 }}
    >
      <div
        className="header-content"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          position: "relative",
        }}
      >
        {/* Back Button */}
        <motion.button
          onClick={onBackToHome}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            backgroundColor: "#e5e7eb",
            color: "#1f2937",
            borderRadius: "50%",
            border: "1px solid #d1d5db",
            transition: "all 0.2s ease",
          }}
          whileHover={{ scale: 1.05, borderColor: "#6b7280", color: "#111827" }}

          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
        </motion.button>
        {/* Right Side */}
        <div className="flex items-center gap-4">
          <HeaderWidget />
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
