import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '../context/AuthContext';
import { generatePlan, getMyPlan } from '../api/plansApi';
import AppShell from '../components/AppShell';

export default function MyPlan() {
  const { token } = useAuth();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!token) return;
      try { setPlan(await getMyPlan(token)); } catch { /* no plan yet */ } finally { setLoading(false); }
    }
    load();
  }, [token]);

  async function handleRegenerate() {
    if (!token) return;
    setRegenerating(true);
    try {
      setPlan(await generatePlan(token));
      toast.success('Plan regenerated');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setRegenerating(false);
    }
  }

  if (loading) return <AppShell title="My Plan"><Skeleton className="h-64" /></AppShell>;

  if (!plan) {
    return (
      <AppShell title="My Plan">
        <p className="text-muted-foreground text-center py-16">No active plan yet. Complete your intake and generate one from the dashboard.</p>
      </AppShell>
    );
  }

  const days: number[] = Array.from(new Set(plan.sessions.map((s: any) => s.dayNumber))) as number[];

  return (
    <AppShell
      title="My Plan"
      subtitle={`${plan.splitType.replace('_', ' ')} · Goal: ${plan.goal.replace('_', ' ')} · Week ${plan.currentWeek}`}
      action={
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={regenerating}>{regenerating ? 'Regenerating…' : 'Regenerate plan'}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Regenerate your plan?</AlertDialogTitle>
              <AlertDialogDescription>This replaces your current plan with a fresh one based on your saved intake data. Your logged history is kept.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRegenerate}>Regenerate</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }
    >
      <div className="space-y-6">
        {days.map((day) => (
          <div key={day}>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">Day {day}</h3>
              <Badge variant="outline">{plan.sessions.filter((s: any) => s.dayNumber === day).length} exercises</Badge>
            </div>
            <Card>
              <CardContent className="pt-4">
                {plan.sessions.filter((s: any) => s.dayNumber === day).map((s: any) => (
                  <div key={s.id}>
                    <div className="flex items-center justify-between py-3 border-b last:border-0 cursor-pointer" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                      <div>
                        <div className="font-medium text-sm">{s.exercise.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{s.targetSets}×{s.targetReps} @ RPE {s.targetRpe}</div>
                      </div>
                      <Badge variant="secondary">{expanded === s.id ? 'Hide' : 'Form cues'}</Badge>
                    </div>
                    {expanded === s.id && (
                      <p className="text-sm text-muted-foreground pb-3">{s.exercise.formCueSummary}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
