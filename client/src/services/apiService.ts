export const apiService = {
  async sendChatMessage(message: string, conversationId?: string) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationId }),
      credentials: 'include'
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to send message');
    }
    return res.json();
  }
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


