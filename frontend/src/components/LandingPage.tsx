import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { authApi } from '../services/api';

const LandingPage: React.FC = () => {
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();

    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');

    if (errorParam) {
      const errorMessages = {
        'invalid_auth_request': 'Invalid authentication request. Please try again.',
        'no_code': 'Authentication failed. Please try again.',
        'token_failed': 'Authentication token error. Please try again.',
        'user_info_failed': 'Failed to get user information. Please try again.',
        'user_creation_failed': 'Account creation failed. Please try again.'
      };
      setError(errorMessages[errorParam as keyof typeof errorMessages] || 'Authentication failed. Please try again.');
    }
  }, []);

  const checkAuthentication = async () => {
    try {
      await authApi.getCurrentUser();
      navigate('/dashboard');
    } catch (err) {
      setAuthLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await authApi.getAuthUrl();
      const data = response.data as { auth_url: string };
      window.location.href = data.auth_url;
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gruvbox-gradient flex items-center justify-center">
        <div className="text-[color:var(--color-42-secondary)] text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gruvbox-gradient">
      <header className="bg-gruvbox-surface/95 backdrop-blur-sm border-b border-[color:var(--color-border)] sticky top-0 z-10">
        <div className="w-full px-12 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[color:var(--color-42-primary)] to-[color:var(--color-42-secondary)] bg-clip-text text-transparent">
            42 Projects
          </h1>
        </div>
      </header>
      <main className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          {error && (
            <div className="mb-6 p-4 bg-[color:var(--color-destructive)]/10 border border-[color:var(--color-destructive)]/20 rounded-lg">
              <p className="text-[color:var(--color-destructive)]">{error}</p>
            </div>
          )}
          <h2 className="text-2xl font-bold text-[color:var(--color-42-primary)] mb-4">Welcome to 42 Projects</h2>
          <p className="text-[color:var(--color-muted-foreground)] mb-8">Discover and explore all outer core projects with better filtering and search</p>
          <Button variant="42-primary" onClick={handleLogin} className="text-lg px-8 py-3">
            Login with 42
          </Button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
