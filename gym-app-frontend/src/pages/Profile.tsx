import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../context/AuthContext';
import AppShell from '../components/AppShell';

export default function Profile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');

  function handleSave() {
    // NOTE: backend PATCH /profile endpoint pending — UI ready for it.
    toast.success('Saved');
  }

  const initials = fullName.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <AppShell title="Profile">
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{fullName}</CardTitle>
              <Badge variant="secondary" className="capitalize mt-1">{user?.role?.replace('_', ' ')}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ''} disabled />
          </div>
          <Button onClick={handleSave}>Save changes</Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
