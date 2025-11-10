export const apiService = {
  async sendChatMessage(message: string, conversationId?: string) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, conversationId }),
      credentials: "include",
    });
    if (!res.ok) {
      // Handle rate limiting gracefully
      if (res.status === 429) {
        const errorData = await res.json().catch(() => ({}));
        const resetTime = errorData.resetTime
          ? new Date(errorData.resetTime).toLocaleTimeString()
          : "later";
        throw new Error(
          errorData.message ||
            `You've explored quite a bit! Please come back after ${resetTime} for more questions. 😊`
        );
      }

      const text = await res.text();
      throw new Error(text || "Failed to send message");
    }
    return res.json();
  },
};

export type ChatResponse = {
  success: boolean;
  conversationId: string;
  response: {
    id: string;
    content: string;
    type: string;
    data?: any;
    timestamp: string;
    aiGenerated?: boolean;
  };
};
