import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      setAuth(data.token, data.user);
      toast.success('Welcome back');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/oauth-callback` },
    });
  }

  return (
<div className="min-h-screen flex flex-col">
  <nav className="px-6 py-6">
    <Link to="/" className="flex items-center text-xl font-bold tracking-tight">
<div
  className="h-8 w-8 mr-2 flex-shrink-0 bg-center bg-no-repeat bg-cover rounded-sm"
  style={{ backgroundImage: "url('/logo.svg')" }}
></div>
      Fitness App<span className="text-primary">.</span>
    </Link>
  </nav>

      

      <div className="flex-1 flex items-center justify-center px-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Log in to pick up where you left off.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full mb-4" onClick={handleGoogleLogin} type="button">
              Continue with Google
            </Button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in…' : 'Log in'}
              </Button>
            </form>

            <p className="mt-4 text-sm text-center text-muted-foreground">
              No account?{' '}
              <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
