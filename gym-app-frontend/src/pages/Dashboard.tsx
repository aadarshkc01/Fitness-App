import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Flame, CalendarCheck, Dumbbell, ListChecks } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { getMyIntake } from '../api/intakeApi';
import { generatePlan, getMyPlan } from '../api/plansApi';
import AppShell from '../components/AppShell';

const SAMPLE_TREND = [
  { session: 'S1', weight: 20 }, { session: 'S2', weight: 20 }, { session: 'S3', weight: 22.5 },
  { session: 'S4', weight: 22.5 }, { session: 'S5', weight: 25 }, { session: 'S6', weight: 25 },
  { session: 'S7', weight: 27.5 },
];

export default function Dashboard() {
  const { user, token } = useAuth();
  const [hasIntake, setHasIntake] = useState<boolean | null>(null);
  const [parQFlagged, setParQFlagged] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      if (!token) return;
      try {
        const intake = await getMyIntake(token);
        setHasIntake(!!intake);
        setParQFlagged(intake?.parQStatus === 'flagged_consult_doctor');
        const currentPlan = await getMyPlan(token);
        setPlan(currentPlan);
      } catch {
        // expected for new users
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, [token]);

  async function handleGeneratePlan() {
    if (!token) return;
    setGenerating(true);
    try {
      const newPlan = await generatePlan(token);
      setPlan(newPlan);
      toast.success('Your plan is ready');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  }

  const totalDays = plan ? new Set(plan.sessions.map((s: any) => s.dayNumber)).size : 0;
  const totalExercises = plan ? plan.sessions.length : 0;
  const days: number[] = plan ? (Array.from(new Set(plan.sessions.map((s: any) => s.dayNumber))) as number[]) : [];

  return (
    <AppShell title={`Welcome back, ${user?.fullName?.split(' ')[0] || ''}`} subtitle="Here's where you stand today.">
      {loading ? (
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {parQFlagged && (
            <div className="flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Based on your health screening, please consult a physician before starting this plan.
            </div>
          )}

          {!hasIntake && (
            <Card className="border-t-2 border-t-primary max-w-lg">
              <CardHeader>
                <CardTitle>Let's build your plan</CardTitle>
                <CardDescription>Answer a few quick questions about your goals, equipment, and any injuries — takes about 2 minutes.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild><Link to="/intake">Start intake</Link></Button>
              </CardContent>
            </Card>
          )}

          {hasIntake && !plan && (
            <Card className="border-t-2 border-t-primary max-w-lg">
              <CardHeader>
                <CardTitle>You're all set to generate a plan</CardTitle>
                <CardDescription>We'll build a training plan around your goals and equipment.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleGeneratePlan} disabled={generating}>
                  {generating ? 'Generating…' : 'Generate my plan'}
                </Button>
              </CardContent>
            </Card>
          )}

          {plan && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Flame} label="Current streak" value="—" hint="Tracked once you log 2+ sessions" />
                <StatCard icon={CalendarCheck} label="Training days" value={String(totalDays)} hint={plan.splitType.replace('_', ' ')} />
                <StatCard icon={Dumbbell} label="Total exercises" value={String(totalExercises)} hint={`Goal: ${plan.goal.replace('_', ' ')}`} />
                <StatCard icon={ListChecks} label="Plan week" value={`Wk ${plan.currentWeek}`} hint="Active plan" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Progress trend</CardTitle>
                    <CardDescription>Sample data — real chart activates once you've logged a few sessions for one exercise.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={SAMPLE_TREND}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="session" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} unit="kg" />
                        <Tooltip />
                        <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">This week</CardTitle>
                    <CardDescription>Your training days at a glance.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {days.map((day) => (
                      <div key={day} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                        <span>Day {day}</span>
                        <Badge variant="outline">
                          {plan.sessions.filter((s: any) => s.dayNumber === day).length} exercises
                        </Badge>
                      </div>
                    ))}
                    <Button asChild variant="outline" className="w-full mt-2">
                      <Link to="/log">Log today's session</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      )}
    </AppShell>
  );
}

function StatCard({ icon: Icon, label, value, hint }: { icon: React.ElementType; label: string; value: string; hint: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">{label}</span>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1 capitalize">{hint}</p>
      </CardContent>
    </Card>
  );
}
