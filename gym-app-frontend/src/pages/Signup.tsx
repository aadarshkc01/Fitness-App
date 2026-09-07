import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { signup } from '../api/authApi';
import { supabase } from '../config/supabaseClient';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  try {
    await signup(email, password, fullName);
    toast.success('Account created — please log in to continue.');
    navigate('/login');
  } catch (err: any) {
    toast.error(err.message || 'Signup failed');
  } finally {
    setLoading(false);
  }
}

  async function handleGoogleSignup() {
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
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Takes about a minute. No card required.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full mb-4" onClick={handleGoogleSignup} type="button">
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
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account…' : 'Sign up'}
              </Button>
            </form>

            <p className="mt-4 text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
