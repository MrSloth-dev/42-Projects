import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  let callbackhasRun = false;
  useEffect(() => {

    const handleCallback = async () => {
      if (callbackhasRun) return;
      callbackhasRun = true;
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      const error = urlParams.get('error');

      if (error) {
        setStatus('error');
        setError(`OAuth error: ${error}`);
        return;
      }

      if (success === 'true') {
        setStatus('success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
        return;
      }

      // If no success or error parameter, something went wrong
      setStatus('error');
      setError('Invalid callback parameters');
    };

    handleCallback();
  }, [navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gruvbox-gradient flex items-center justify-center">
        <div className="text-[color:var(--color-42-secondary)] text-lg font-medium">Authenticating with 42...</div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gruvbox-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="text-[color:var(--color-destructive)] text-lg font-medium mb-4">Authentication Error</div>
          <div className="text-[color:var(--color-muted-foreground)] mb-4">{error}</div>
          <button
            onClick={() => navigate('/')}
            className="bg-[color:var(--color-42-primary)] hover:bg-[color:var(--gb-neutral-orange)] text-[color:var(--gb-dark0)] font-semibold py-2 px-4 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gruvbox-gradient flex items-center justify-center">
      <div className="text-center">
        <div className="text-[color:var(--color-42-highlight)] text-lg font-medium mb-4">Authentication Successful!</div>
        <div className="text-[color:var(--color-muted-foreground)]">Redirecting to dashboard...</div>
      </div>
    </div>
  );
};

export default OAuthCallback;
