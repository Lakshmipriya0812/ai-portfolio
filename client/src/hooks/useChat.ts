import { useState, useRef, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { apiService } from "../services/apiService";
import { ChatInteraction } from "../types/chat";

export const useChat = (initialQuery?: string) => {
  const [currentInteraction, setCurrentInteraction] =
    useState<ChatInteraction | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentInteraction, scrollToBottom]);

  const handleSendMessage = useCallback(
    async (message?: string) => {
      // Block if rate limited
      if (isRateLimited) {
        return;
      }

      const question = message ?? inputValue;
      if (!question.trim()) return;

      setInputValue("");
      setIsLoading(true);

      const newInteraction: ChatInteraction = {
        id: Date.now().toString(),
        question,
        response: "",
        timestamp: new Date(),
        isLoading: true,
      };

      setCurrentInteraction(newInteraction);

      try {
        const resData = await apiService.sendChatMessage(question);
        const aiText = resData.aiText;
        const structured = resData.structured;

        setCurrentInteraction({
          ...newInteraction,
          response: aiText,
          structured,
          isLoading: false,
        });
      } catch (err: any) {
        const errorMessage =
          err?.message || "Something went wrong. Please try again.";

        // Check if rate limited (429 error)
        if (
          errorMessage.includes("explored quite a bit") ||
          errorMessage.includes("rate limit")
        ) {
          setIsRateLimited(true);
          setRateLimitMessage(errorMessage);
        }

        setCurrentInteraction({
          ...newInteraction,
          response: errorMessage,
          structured: undefined,
          isLoading: false,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [inputValue, isRateLimited]
  );

  // Handle initial query only once
  const hasProcessedInitialQuery = useRef(false);

  useEffect(() => {
    if (
      initialQuery &&
      initialQuery.trim() &&
      !hasProcessedInitialQuery.current
    ) {
      hasProcessedInitialQuery.current = true;
      setInputValue(initialQuery);
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]); // Remove handleSendMessage from dependencies

  const handleQuickQuestion = useCallback(
    (question: string) => {
      setInputValue(question);
      handleSendMessage(question);
    },
    [handleSendMessage]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  return {
    currentInteraction,
    inputValue,
    setInputValue,
    isLoading,
    isRateLimited,
    rateLimitMessage,
    messagesEndRef,
    handleSendMessage,
    handleQuickQuestion,
    handleKeyPress,
  };
};
