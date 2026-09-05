import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    async function completeLogin() {
      const { data: sessionData } = await supabase.auth.getSession();
      const supabaseAccessToken = sessionData.session?.access_token;

      if (!supabaseAccessToken) {
        navigate('/login');
        return;
      }

      const res = await fetch(`${API_URL}/auth/oauth-exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseAccessToken }),
      });

      if (!res.ok) {
        toast.error('Google sign-in failed');
        navigate('/login');
        return;
      }

      const result = await res.json();
      setAuth(result.data.token, result.data.user);
      toast.success('Welcome back');
      navigate('/dashboard');
    }
    completeLogin();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Signing you in…</p>
    </div>
  );
}
