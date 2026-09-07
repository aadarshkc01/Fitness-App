import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../config/supabaseClient';
import AppShell from '../components/AppShell';

export default function Settings() {
  const { mode, setMode } = useTheme();
  const { user, clearAuth } = useAuth();
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    async function checkProvider() {
      const { data: userData } = await supabase.auth.getUser();
      const providers = userData.user?.app_metadata?.providers as string[] | undefined;
      const singleProvider = userData.user?.app_metadata?.provider;
      setIsGoogleUser(!!providers?.includes('google') || singleProvider === 'google');
    }
    checkProvider();
  }, []);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

async function handleChangePassword(e: React.FormEvent) {
  e.preventDefault();
  if (newPassword.length < 8) return toast.error('New password must be at least 8 characters.');
  if (newPassword !== confirmPassword) return toast.error('New password and confirmation do not match.');
  if (!user?.email) return toast.error('Could not verify account email.');

  setPwLoading(true);
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const isGoogleUser = sessionData.session?.user?.app_metadata?.provider === 'google';
    if (isGoogleUser) {
      toast.error('You signed in with Google — there\'s no password to change on this account.');
      return;
    }

    const { error: reAuthError } = await supabase.auth.signInWithPassword({ email: user.email, password: currentPassword });
    if (reAuthError) return toast.error('Current password is incorrect.');

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) return toast.error(updateError.message);

      toast.success('Password updated successfully');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } finally {
      setPwLoading(false);
    }
  }

async function handleDeleteAccount() {
  if (deleteConfirmText !== 'DELETE') return toast.error('Type DELETE exactly to confirm.');
  if (!user?.email) return toast.error('Could not verify account.');

  setDeleteLoading(true);
  try {
    if (!isGoogleUser) {
      const { error: reAuthError } = await supabase.auth.signInWithPassword({ email: user.email, password: deletePassword });
      if (reAuthError) return toast.error('Password is incorrect.');
    }

      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/auth/delete-account`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });

      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        return toast.error(result.message || 'Account deletion endpoint not yet available.');
      }

        toast.success('Account permanently deleted');
        clearAuth();
        setTimeout(() => { window.location.href = '/'; }, 1500);
            } finally {
              setDeleteLoading(false);
            }
  }

  return (
    <AppShell title="Settings">
      <Tabs defaultValue="preferences" orientation="vertical" className="flex gap-6 max-w-3xl">
<TabsList className="flex-col h-fit w-48 items-stretch bg-transparent p-0">
  <TabsTrigger 
    value="preferences" 
    className="justify-start cursor-pointer text-[15px] font-semibold transform transition-all duration-300 ease-in-out 
               hover:translate-x-1 hover:bg-accent/30 
               data-[state=active]:bg-accent data-[state=active]:text-primary data-[state=active]:shadow-md"
  >
    Preferences
  </TabsTrigger>

  <TabsTrigger 
    value="security" 
    className="justify-start cursor-pointer text-[15px] font-semibold transform transition-all duration-300 ease-in-out 
               hover:translate-x-1 hover:bg-accent/30 
               data-[state=active]:bg-accent data-[state=active]:text-primary data-[state=active]:shadow-md"
  >
    Security
  </TabsTrigger>

  <TabsTrigger 
    value="danger" 
    className="justify-start cursor-pointer text-[15px] font-semibold transform transition-all duration-300 ease-in-out 
               hover:translate-x-1 hover:bg-accent/30 
               data-[state=active]:bg-accent data-[state=active]:text-primary data-[state=active]:shadow-md"
  >
    Danger Zone
  </TabsTrigger>
</TabsList>

  <div className="flex-1">

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Theme</CardTitle>
              <CardDescription>Choose how FORM. looks on this device.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3">
              {([
                { key: 'light', label: 'Light', icon: Sun },
                { key: 'dark', label: 'Dark', icon: Moon },
                { key: 'system', label: 'System', icon: Monitor },
              ] as const).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setMode(opt.key)}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors cursor-pointer ${
                    mode === opt.key ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                  }`}
                >
                  <opt.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
<CardHeader>
  <CardTitle className="text-base">Change password</CardTitle>
  <CardDescription>
    {isGoogleUser ? 'This account uses Google sign‑in. Password management is handled by Google and cannot be changed here.' : 'Your current password is required to confirm this change.'}
  </CardDescription>
</CardHeader>
<CardContent>
  {isGoogleUser ? (
    <p className="text-sm text-muted-foreground rounded-md border bg-muted p-4">
      You signed in with Google — there's no password on this account to change.
    </p>
  ) : (
    <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
      <div className="space-y-2">
        <Label>Current password</Label>
        <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label>New password</Label>
        <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} />
      </div>
      <div className="space-y-2">
        <Label>Confirm new password</Label>
        <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} />
      </div>
      <Button type="submit" disabled={pwLoading}>{pwLoading ? 'Updating…' : 'Update password'}</Button>
    </form>
  )}
</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger">
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-base text-destructive">Delete account</CardTitle>
              <CardDescription>This permanently deletes your account, intake profile, plans, and logged history. This cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete my account</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>This is permanent</DialogTitle>
                    <DialogDescription>
                      Type <strong>DELETE</strong> and enter your password to confirm. All your data will be permanently removed.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Input placeholder="Type DELETE" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} />
                    {!isGoogleUser && (
                      <Input type="password" placeholder="Your password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteLoading}>
                      {deleteLoading ? 'Deleting…' : 'Permanently delete'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
        </div>
</Tabs>
    </AppShell>
  );
}
