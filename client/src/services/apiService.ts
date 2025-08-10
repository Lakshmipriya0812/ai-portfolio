// API service for connecting to the backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  responseType?: string;
  data?: any;
}

export interface ChatResponse {
  success: boolean;
  conversationId: string;
  response: {
    id: string;
    content: string;
    type: string;
    data: any;
    timestamp: string;
    aiGenerated: boolean;
  };
  conversation: {
    id: string;
    messageCount: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface StreamingChunk {
  type: 'token' | 'complete' | 'error';
  content: string;
  isComplete: boolean;
  data?: any;
  responseType?: string;
  id?: string;
  timestamp?: string;
}

export interface PortfolioData {
  profile: any;
  projects: any[];
  skills: any[];
  experience: any[];
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Generic API request helper
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Chat API methods
  async sendChatMessage(
    message: string,
    conversationId?: string,
    stream: boolean = false
  ): Promise<ChatResponse> {
    return this.makeRequest<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        conversationId,
        stream
      }),
    });
  }

  // Streaming chat method
  async *streamChatMessage(
    message: string,
    conversationId?: string
  ): AsyncGenerator<StreamingChunk, void, unknown> {
    const url = `${this.baseUrl}/chat/stream`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          
          // Keep the last incomplete line in the buffer
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6); // Remove 'data: ' prefix
              
              if (data === '[DONE]') {
                return;
              }
              
              try {
                const chunk: StreamingChunk = JSON.parse(data);
                yield chunk;
              } catch (parseError) {
                console.warn('Failed to parse streaming chunk:', data);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error('Streaming chat failed:', error);
      yield {
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.',
        isComplete: true,
      };
    }
  }

  // Get conversation history
  async getConversation(conversationId: string): Promise<{ success: boolean; conversation: any }> {
    return this.makeRequest(`/chat/conversation/${conversationId}`);
  }

  // Get all conversations
  async getConversations(): Promise<{ success: boolean; conversations: any[]; total: number }> {
    return this.makeRequest('/chat/conversations');
  }

  // Delete conversation
  async deleteConversation(conversationId: string): Promise<{ success: boolean; message: string }> {
    return this.makeRequest(`/chat/conversation/${conversationId}`, {
      method: 'DELETE',
    });
  }

  // Portfolio API methods
  async getPortfolioData(): Promise<PortfolioData> {
    const response = await this.makeRequest<{ success: boolean; data: PortfolioData }>('/portfolio');
    return response.data;
  }

  async getProfile(): Promise<any> {
    const response = await this.makeRequest<{ success: boolean; data: any }>('/portfolio/profile');
    return response.data;
  }

  async getProjects(filters?: {
    technology?: string;
    limit?: number;
    category?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.technology) params.append('technology', filters.technology);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.category) params.append('category', filters.category);

    const response = await this.makeRequest<{ success: boolean; data: any[] }>(
      `/portfolio/projects${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  }

  async getProject(id: string): Promise<any> {
    const response = await this.makeRequest<{ success: boolean; data: any }>(`/portfolio/projects/${id}`);
    return response.data;
  }

  async getSkills(filters?: {
    category?: string;
    proficiency?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.proficiency) params.append('proficiency', filters.proficiency);

    const response = await this.makeRequest<{ success: boolean; data: any[] }>(
      `/portfolio/skills${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  }

  async getExperience(filters?: {
    company?: string;
    duration?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.company) params.append('company', filters.company);
    if (filters?.duration) params.append('duration', filters.duration);

    const response = await this.makeRequest<{ success: boolean; data: any[] }>(
      `/portfolio/experience${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  }

  async searchPortfolio(query: string): Promise<{
    projects: any[];
    skills: any[];
    experience: any[];
  }> {
    const response = await this.makeRequest<{ success: boolean; results: any }>(
      `/portfolio/search?q=${encodeURIComponent(query)}`
    );
    return response.results;
  }

  async getTechnologies(): Promise<string[]> {
    const response = await this.makeRequest<{ success: boolean; data: string[] }>('/portfolio/technologies');
    return response.data;
  }

  async getPortfolioStats(): Promise<any> {
    const response = await this.makeRequest<{ success: boolean; data: any }>('/portfolio/stats');
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; uptime: number }> {
    const baseUrl = this.baseUrl.replace('/api', '');
    return this.makeRequest(`${baseUrl}/health`);
  }

  // Error handling utility
  handleApiError(error: any): string {
    if (error.message) {
      return error.message;
    }
    if (error.status) {
      return `HTTP Error: ${error.status}`;
    }
    return 'An unexpected error occurred';
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export individual methods for convenience
export const {
  sendChatMessage,
  streamChatMessage,
  getConversation,
  getConversations,
  deleteConversation,
  getPortfolioData,
  getProfile,
  getProjects,
  getProject,
  getSkills,
  getExperience,
  searchPortfolio,
  getTechnologies,
  getPortfolioStats,
  healthCheck,
  handleApiError,
} = apiService;

export default apiService;
