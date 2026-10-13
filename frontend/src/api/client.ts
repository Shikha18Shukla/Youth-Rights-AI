import type { ChatResponse, Chat, HealthResponse, User, Message } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  async register(username: string, email: string, password: string): Promise<{ success: boolean; token: string; user: User }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async login(email: string, password: string): Promise<{ success: boolean; token: string; user: User }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile(): Promise<{ success: boolean; user: User }> {
    return this.request('/auth/profile');
  }

  async askQuestion(question: string, chatId?: string): Promise<ChatResponse> {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ question, chatId }),
    });
  }

  async getChatHistory(): Promise<{ success: boolean; chats: Chat[] }> {
    return this.request('/chat/history');
  }

  async getChatById(id: string): Promise<{ success: boolean; chat: Chat; messages: Message[] }> {
    return this.request(`/chat/${id}`);
  }

  async deleteChat(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/chat/${id}`, { method: 'DELETE' });
  }

  async renameChat(id: string, title: string): Promise<{ success: boolean; chat: Chat }> {
    return this.request(`/chat/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title }),
    });
  }
}

export const apiClient = new ApiClient();
