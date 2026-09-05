import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { logSession } from '../api/sessionLogsApi';

interface Props {
  planSessionId: string;
  exerciseName: string;
  targetSets: number;
  targetReps: number;
  targetRpe: number;
}

export default function ExerciseLogger({ planSessionId, exerciseName, targetSets, targetReps, targetRpe }: Props) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [sets, setSets] = useState(targetSets);
  const [reps, setReps] = useState(targetReps);
  const [weight, setWeight] = useState(0);
  const [rpe, setRpe] = useState(targetRpe);
  const [saving, setSaving] = useState(false);
  const [logged, setLogged] = useState(false);
  const [guidanceMsg, setGuidanceMsg] = useState<string | null>(null);

  async function handleSave() {
    if (!token) return;
    setSaving(true);
    try {
      const result = await logSession(token, { planSessionId, actualSets: sets, actualReps: reps, actualWeight: weight, actualRpe: rpe });
      const guidance = result.nextSessionGuidance;
      const msg =
        guidance.action === 'increase_weight' ? `Nice work — add ~${guidance.percentIncrease}% next session.` :
        guidance.action === 'decrease_weight' ? `Ease off slightly — reduce load ~${guidance.percentDecrease}% next time.` :
        guidance.action === 'deload' ? 'Deload recommended — take this next session lighter.' :
        'Solid session. Hold this weight next time.';
      setGuidanceMsg(msg);
      setLogged(true);
      toast.success('Session logged');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between py-3 border-b last:border-0 cursor-pointer" onClick={() => setOpen(!open)}>
        <div>
          <div className="font-medium text-sm">{exerciseName}</div>
          <div className="text-xs text-muted-foreground font-mono">{targetSets}×{targetReps} @ RPE {targetRpe}</div>
        </div>
        {logged ? <Badge variant="secondary" className="bg-green-500/10 text-green-600">Logged</Badge> : <Badge variant="outline">{open ? 'Close' : 'Log set'}</Badge>}
      </div>

      {open && (
        <div className="pb-4 space-y-3">
          <div className="grid grid-cols-4 gap-2">
            <div><Label className="text-xs">Sets</Label><Input type="number" value={sets} onChange={(e) => setSets(Number(e.target.value))} /></div>
            <div><Label className="text-xs">Reps</Label><Input type="number" value={reps} onChange={(e) => setReps(Number(e.target.value))} /></div>
            <div><Label className="text-xs">Weight (kg)</Label><Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} /></div>
            <div><Label className="text-xs">RPE</Label><Input type="number" min={1} max={10} value={rpe} onChange={(e) => setRpe(Number(e.target.value))} /></div>
          </div>
          <Button onClick={handleSave} disabled={saving} size="sm">{saving ? 'Saving…' : 'Save set'}</Button>
          {guidanceMsg && (
            <p className="rounded-md bg-primary/10 text-primary text-sm px-3 py-2 font-medium">{guidanceMsg}</p>
          )}
        </div>
      )}
    </div>
  );
}
