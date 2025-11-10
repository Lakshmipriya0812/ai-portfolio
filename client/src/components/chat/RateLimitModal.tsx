import React from "react";
import { motion } from "framer-motion";

interface RateLimitModalProps {
  message: string;
}

const RateLimitModal: React.FC<RateLimitModalProps> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="rate-limit-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="rate-limit-modal"
        style={{
          backgroundColor: "white",
          borderRadius: "1rem",
          padding: "2rem",
          maxWidth: "28rem",
          width: "100%",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Icon */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: "4rem",
              height: "4rem",
              borderRadius: "50%",
              backgroundColor: "#FEE2E2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              style={{ width: "2rem", height: "2rem", color: "#DC2626" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#1F2937",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          Rate Limit Reached
        </h3>

        {/* Message */}
        <p
          style={{
            fontSize: "0.95rem",
            color: "#6B7280",
            textAlign: "center",
            lineHeight: "1.6",
            marginBottom: "1.5rem",
          }}
        >
          {message}
        </p>

        {/* Info Box */}
        <div
          style={{
            backgroundColor: "#F3F4F6",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginTop: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "0.85rem",
              color: "#4B5563",
              textAlign: "center",
              margin: 0,
            }}
          >
            💡 Your previous interactions are cached and will be available when
            you return.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RateLimitModal;
