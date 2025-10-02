import { useState, useRef, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { apiService } from '../services/apiService';
import { ChatInteraction } from '../types/chat';

export const useChat = (initialQuery?: string) => {
  const [currentInteraction, setCurrentInteraction] = useState<ChatInteraction | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentInteraction, scrollToBottom]);

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
      const resData = await apiService.sendChatMessage(question);
      console.log('useChat - API Response:', resData);
      
      const aiText = resData.aiText;
      const structured = resData.structured;

      setCurrentInteraction({
        ...newInteraction,
        response: aiText,
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

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setInputValue(initialQuery);
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, handleSendMessage]);

  const debouncedSend = useRef(
    debounce((msg: string) => {
      handleSendMessage(msg);
    }, 300)
  ).current;

  const handleQuickQuestion = useCallback((question: string) => {
    setInputValue(question);
    debouncedSend(question);
  }, [debouncedSend]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return {
    currentInteraction,
    inputValue,
    setInputValue,
    isLoading,
    messagesEndRef,
    handleSendMessage,
    handleQuickQuestion,
    handleKeyPress
  };
};
