import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppShell from '../components/AppShell';

const SAMPLE_TREND = [
  { session: 'S1', weight: 20 }, { session: 'S2', weight: 20 }, { session: 'S3', weight: 22.5 },
  { session: 'S4', weight: 22.5 }, { session: 'S5', weight: 25 }, { session: 'S6', weight: 25 },
  { session: 'S7', weight: 27.5 },
];

export default function Progress() {
  return (
    <AppShell title="Progress" subtitle="Sample data shown below — real charts activate once you've logged a few sessions.">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Back Squat — working weight</CardTitle>
          <CardDescription>Last 7 sessions (sample) — trending +37.5% from starting weight.</CardDescription>
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
    </AppShell>
  );
}
