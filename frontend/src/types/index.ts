export interface Source {
  documentId: string | null;
  documentName: string;
  article: string | null;
  pageNumber: number;
  snippet: string;
  score: number;
  sourceUrl: string | null;
  category: string;
  topic: string;
}

export interface Message {
  _id: string;
  chatId: string;
  sender: 'user' | 'bot';
  content: string;
  sources: Source[];
  createdAt: string;
}

export interface Chat {
  _id: string;
  userId: string;
  title: string;
  model: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface ChatResponse {
  success: boolean;
  chatId: string;
  chatTitle: string;
  userMessage: Message;
  botMessage: Message;
  sources: Source[];
  grounded: boolean;
}

export interface HealthResponse {
  success: boolean;
  message: string;
  timestamp: string;
  database: {
    connected: boolean;
    host: string | null;
    name: string | null;
  };
  llm: {
    provider: string;
    model: string;
    configured: boolean;
  };
}
