import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setAccessToken } from '@/api/client';
import { Loader2 } from 'lucide-react';

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Save token to localStorage
      setAccessToken(token);
      
      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } else {
      // No token found, redirect to login
      navigate('/auth/login', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground">Signing you in...</h2>
        <p className="text-muted-foreground mt-2">Please wait while we complete your login.</p>
      </div>
    </div>
  );
}
