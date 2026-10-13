import { useState, useRef, useEffect } from 'react';
import type { Message, Chat } from '../types';
import { apiClient } from '../api/client';
import { SourceCard } from './SourceCard';

interface ChatInterfaceProps {
  onLogout: () => void;
}

export function ChatInterface({ onLogout }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await apiClient.getChatHistory();
      if (response.success) {
        setChats(response.chats);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  const handleSend = async () => {
    const question = input.trim();
    if (!question || isLoading) return;

    setInput('');
    setError(null);
    setIsLoading(true);

    const userMessage: Message = {
      _id: `user-${Date.now()}`,
      chatId: chatId || '',
      sender: 'user',
      content: question,
      sources: [],
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await apiClient.askQuestion(question, chatId || undefined);
      if (response.success) {
        setChatId(response.chatId);
        setMessages((prev) => [...prev, response.botMessage]);
        loadChatHistory();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setChatId(null);
    setError(null);
    setShowHistory(false);
  };

  const handleSelectChat = async (selectedChatId: string) => {
    try {
      const response = await apiClient.getChatById(selectedChatId);
      if (response.success) {
        setChatId(response.chat._id);
        setMessages(response.messages);
        setShowHistory(false);
      }
    } catch (err) {
      console.error('Failed to load chat:', err);
    }
  };

  return (
    <div className="h-screen flex bg-ivory">
      {/* Sidebar - Chat History */}
      <aside
        className={`${
          showHistory ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static lg:translate-x-0 z-30 w-72 bg-cream border-r border-border h-full transition-transform duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-border">
          <button
            onClick={handleNewChat}
            className="w-full px-4 py-2 bg-forest text-white rounded-lg hover:bg-forest-light transition-colors font-medium"
          >
            + New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {chats.length === 0 ? (
            <p className="text-sage-dark text-sm text-center py-8">No conversations yet</p>
          ) : (
            <div className="space-y-1">
              {chats.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => handleSelectChat(chat._id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    chatId === chat._id
                      ? 'bg-forest text-white'
                      : 'text-charcoal hover:bg-sage-light'
                  }`}
                >
                  <span className="block truncate">{chat.title}</span>
                  <span className={`text-xs ${chatId === chat._id ? 'text-sage-light' : 'text-sage-dark'}`}>
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-border">
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-charcoal-light hover:text-forest hover:bg-sage-light rounded-lg transition-colors text-sm"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {showHistory && (
        <div
          className="fixed inset-0 bg-charcoal-dark/30 z-20 lg:hidden"
          onClick={() => setShowHistory(false)}
        />
      )}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-forest text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="lg:hidden p-2 hover:bg-forest-light rounded-lg"
              aria-label="Toggle history"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="font-bold">Youth Rights AI</h1>
              <p className="text-xs text-sage-light">Legal information, not legal advice</p>
            </div>
          </div>
          <div className="text-xs text-sage-light hidden sm:block">
            Educational use only
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-5xl mb-4 block">⚖️</span>
                <h2 className="text-2xl font-bold text-charcoal mb-2">Welcome to Youth Rights AI</h2>
                <p className="text-charcoal-light mb-8 max-w-md mx-auto">
                  Ask a question about Indian law and youth rights. I'll provide explanations grounded in
                  official legal sources.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                  {[
                    'Can my college refuse to return my original documents?',
                    'What are my rights if my internship stipend is not paid?',
                    'What can I do if someone creates a fake social media account?',
                    'What protections exist against ragging?',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="text-left px-4 py-3 bg-cream rounded-lg border border-border hover:border-forest hover:bg-sage-light transition-colors text-sm text-charcoal"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message._id}>
                  <div
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-forest text-white'
                          : 'bg-cream border border-border text-charcoal'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  </div>
                  {/* Sources */}
                  {message.sender === 'bot' && message.sources && message.sources.length > 0 && (
                    <div className="mt-2 ml-2">
                      <p className="text-xs text-gold-dark font-medium mb-2 flex items-center gap-1">
                        <span>📜</span> Sources:
                      </p>
                      <div className="space-y-2">
                        {message.sources.map((source, idx) => (
                          <SourceCard key={idx} source={source} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-cream border border-border rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-charcoal-light text-sm">
                    <div className="animate-spin w-4 h-4 border-2 border-forest border-t-transparent rounded-full" />
                    Searching legal sources and generating answer...
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-cream px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about Indian law..."
                className="flex-1 px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent text-sm bg-white text-charcoal"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-forest text-white rounded-xl hover:bg-forest-light transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '...' : 'Send'}
              </button>
            </div>
            <p className="text-xs text-sage-dark mt-2 text-center">
              This is general legal information, not legal advice. For advice specific to your situation,
              please consult a qualified lawyer.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
