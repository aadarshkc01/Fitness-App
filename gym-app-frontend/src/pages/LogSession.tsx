import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '../context/AuthContext';
import { getMyPlan } from '../api/plansApi';
import AppShell from '../components/AppShell';
import ExerciseLogger from '../components/ExerciseLogger';

export default function LogSession() {
  const { token } = useAuth();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      if (!token) return;
      try {
        const p = await getMyPlan(token);
        setPlan(p);
        if (p) setSelectedDay(p.sessions[0]?.dayNumber ?? null);
      } catch { /* no plan yet */ } finally { setLoading(false); }
    }
    load();
  }, [token]);

  if (loading) return <AppShell title="Log a Session"><Skeleton className="h-64" /></AppShell>;

  if (!plan) {
    return <AppShell title="Log a Session"><p className="text-muted-foreground text-center py-16">No active plan yet. Generate one from the dashboard first.</p></AppShell>;
  }

  const days: number[] = Array.from(new Set(plan.sessions.map((s: any) => s.dayNumber))) as number[];

  return (
    <AppShell title="Log a Session" subtitle="Pick a day, expand an exercise, enter what you actually did.">
      <div className="flex flex-wrap gap-2 mb-6">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`cursor-pointer px-4 py-2 rounded-md text-sm border transition-colors ${
              selectedDay === d ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-accent'
            }`}
          >
            Day {d}
          </button>
        ))}
      </div>

      <Card className="max-w-2xl">
        <CardContent className="pt-4">
          {plan.sessions.filter((s: any) => s.dayNumber === selectedDay).map((s: any) => (
            <ExerciseLogger key={s.id} planSessionId={s.id} exerciseName={s.exercise.name} targetSets={s.targetSets} targetReps={s.targetReps} targetRpe={s.targetRpe} />
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
