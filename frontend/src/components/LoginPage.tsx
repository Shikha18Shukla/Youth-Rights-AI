import { useState } from 'react';
import { apiClient } from '../api/client';

interface LoginPageProps {
  onLoginSuccess: (token: string) => void;
  onBack: () => void;
}

export function LoginPage({ onLoginSuccess, onBack }: LoginPageProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = isRegister
        ? await apiClient.register(username, email, password)
        : await apiClient.login(email, password);

      if (response.success) {
        localStorage.setItem('token', response.token);
        apiClient.setToken(response.token);
        onLoginSuccess(response.token);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="mb-4 text-charcoal-light hover:text-forest text-sm flex items-center gap-1"
        >
          ← Back to home
        </button>
        <div className="bg-cream rounded-2xl shadow-xl border border-border p-8">
          <div className="text-center mb-6">
            <span className="text-4xl mb-2 block">⚖️</span>
            <h1 className="text-2xl font-bold text-charcoal">
              {isRegister ? 'Create Account' : 'Sign In'}
            </h1>
            <p className="text-charcoal-light text-sm mt-1">
              {isRegister ? 'Join Youth Rights AI' : 'Welcome back to Youth Rights AI'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent text-sm bg-white text-charcoal"
                  required
                  minLength={3}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent text-sm bg-white text-charcoal"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent text-sm bg-white text-charcoal"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-forest text-white rounded-lg hover:bg-forest-light transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-forest hover:underline text-sm"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
