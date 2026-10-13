import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { ChatInterface } from './components/ChatInterface';
import { LoginPage } from './components/LoginPage';
import { apiClient } from './api/client';

type Page = 'landing' | 'login' | 'chat';

function App() {
  const [page, setPage] = useState<Page>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiClient.setToken(token);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('token', token);
    apiClient.setToken(token);
    setIsAuthenticated(true);
    setPage('chat');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    apiClient.setToken(null);
    setIsAuthenticated(false);
    setPage('landing');
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setPage('chat');
    } else {
      setPage('login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  switch (page) {
    case 'login':
      return <LoginPage onLoginSuccess={handleLoginSuccess} onBack={() => setPage('landing')} />;
    case 'chat':
      return <ChatInterface onLogout={handleLogout} />;
    default:
      return (
        <LandingPage
          onGetStarted={handleGetStarted}
          onLogin={() => setPage('login')}
          isAuthenticated={isAuthenticated}
        />
      );
  }
}

export default App;
