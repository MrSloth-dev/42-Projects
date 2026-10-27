import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';

type Status = 'loading' | 'success' | 'error';

const OAuthCallback: React.FC = () => {
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    let hasRun = false;

    const handleCallback = async () => {
      if (hasRun) return;
      hasRun = true;

      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      const errorParam = urlParams.get('error');

      if (errorParam) {
        setStatus('error');
        setError(`OAuth error: ${errorParam}`);
        return;
      }

      if (success === 'true') {
        setStatus('success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
        return;
      }

      setStatus('error');
      setError('Invalid callback parameters');
    };

    handleCallback();
  }, [navigate]);

  const icon =
    status === 'success' ? (
      <ShieldCheck className="h-6 w-6 text-[color:var(--brand-cyan-dark)]" />
    ) : status === 'error' ? (
      <ShieldAlert className="h-6 w-6 text-destructive" />
    ) : (
      <Loader2 className="h-6 w-6 animate-spin text-[color:var(--brand-magenta)]" />
    );

  return (
    <div className="grid-canvas flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mx-auto mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-surface-low">
          {icon}
        </div>

        {status === 'loading' && (
          <>
            <h1 className="mt-5 text-xl font-semibold tracking-[-0.01em]">
              Authenticating with 42…
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Verifying your session. This only takes a moment.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <h1 className="mt-5 text-xl font-semibold tracking-[-0.01em]">
              Authentication successful
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Taking you to the project explorer…
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="mt-5 text-xl font-semibold tracking-[-0.01em]">
              Authentication failed
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button className="mt-6 w-full" onClick={() => navigate('/')}>
              Back to home
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
