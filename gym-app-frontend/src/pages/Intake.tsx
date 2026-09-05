import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { submitIntake } from '../api/intakeApi';
import type { IntakeFormData } from '../api/intakeApi';
import { useAuth } from '../context/AuthContext';
import { useIntakeDraft } from '../hooks/useIntakeDraft';

const TOTAL_STEPS = 5;

const GOALS = [
  { value: 'fat_loss', label: 'Fat loss' },
  { value: 'muscle_gain', label: 'Muscle gain' },
  { value: 'strength', label: 'Strength' },
  { value: 'general_fitness', label: 'General fitness' },
  { value: 'endurance', label: 'Endurance' },
];

const EQUIPMENT_OPTIONS = [
  { value: 'bodyweight_only', label: 'Bodyweight only' },
  { value: 'home_dumbbells', label: 'Dumbbells at home' },
  { value: 'full_gym', label: 'Full gym access' },
];

const INJURY_OPTIONS = ['knee', 'shoulder', 'lower_back', 'elbow', 'wrist', 'none'];

const MEDICAL_OPTIONS = [
  { value: 'heart_condition', label: 'Heart condition' },
  { value: 'chest_pain_with_activity', label: 'Chest pain during activity' },
  { value: 'uncontrolled_blood_pressure', label: 'Uncontrolled blood pressure' },
  { value: 'recent_surgery', label: 'Recent surgery' },
  { value: 'pregnancy_complications', label: 'Pregnancy complications' },
  { value: 'dizziness_or_fainting', label: 'Dizziness or fainting spells' },
  { value: 'none', label: 'None of the above' },
];

type FieldErrors = Record<string, string>;

export default function Intake() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const { data: form, setData: setForm, clearDraft } = useIntakeDraft<Partial<IntakeFormData>>({
    injuryFlags: [], medicalFlags: [],
  });

  function update<K extends keyof IntakeFormData>(key: K, value: IntakeFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  }

  function toggleTag(key: 'injuryFlags' | 'medicalFlags', value: string) {
    setForm((prev) => {
      const current = prev[key] || [];
      const exists = current.includes(value);

      // Selecting "none" clears everything else; selecting anything else removes "none"
      if (value === 'none') {
        return { ...prev, [key]: exists ? [] : ['none'] };
      }
      const withoutNone = current.filter((v) => v !== 'none');
      return { ...prev, [key]: exists ? withoutNone.filter((v) => v !== value) : [...withoutNone, value] };
    });
  }

  function validateStep(s: number): FieldErrors {
    const e: FieldErrors = {};
    if (s === 1) {
      if (!form.age || form.age < 13 || form.age > 100) e.age = 'Enter an age between 13 and 100.';
      if (!form.sex) e.sex = 'Please select an option.';
      if (!form.heightCm || form.heightCm < 100 || form.heightCm > 250) e.heightCm = 'Enter a height between 100–250 cm.';
      if (!form.weightKg || form.weightKg < 30 || form.weightKg > 300) e.weightKg = 'Enter a weight between 30–300 kg.';
    }
    if (s === 2 && !form.goal) e.goal = 'Select a goal to continue.';
    if (s === 3) {
      if (!form.experienceLevel) e.experienceLevel = 'Please select your experience level.';
      if (!form.daysAvailable || form.daysAvailable < 1 || form.daysAvailable > 7) e.daysAvailable = 'Enter a number between 1 and 7.';
      if (!form.sessionDurationMinutes || form.sessionDurationMinutes < 15 || form.sessionDurationMinutes > 180) e.sessionDurationMinutes = 'Enter minutes between 15 and 180.';
      if (!form.equipmentAccess) e.equipmentAccess = 'Please select your equipment access.';
    }

    if (s === 4 && (!form.injuryFlags || form.injuryFlags.length === 0)) {
      e.injuryFlags = 'Select at least one option, or choose "none".';
    }

    return e;
  }

  function handleNext() {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
    setErrors({});
    setStep(step + 1);
  }

  async function handleFinish() {
    const stepErrors = validateStep(3);
    if (Object.keys(stepErrors).length > 0) { setStep(3); setErrors(stepErrors); return; }
    if (!token) return;
    setLoading(true);
    try {
      await submitIntake(token, form as IntakeFormData);
      clearDraft();
      toast.success('Intake saved');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-6">
        <Link to="/dashboard" className="flex items-center text-xl font-bold tracking-tight">
        <div
  className="h-8 w-8 mr-2 flex-shrink-0 bg-center bg-no-repeat bg-cover rounded-sm"
  style={{ backgroundImage: "url('/logo.svg')" }}
></div>
        Fitness App<span className="text-primary">.</span></Link>
        <Button variant="ghost" size="sm" onClick={() => setShowCancelConfirm(true)}>Cancel</Button>
      </nav>

      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="flex gap-1.5 mb-8">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < step ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">The basics</h2>
                <p className="text-sm text-muted-foreground mt-1">We use this to set safe starting points for your plan.</p>
              </div>
              <div>
                <Input type="number" placeholder="Age" value={form.age ?? ''} onChange={(e) => update('age', Number(e.target.value))} className={errors.age ? 'border-destructive' : ''} />
                {errors.age && <p className="text-xs text-destructive mt-1">{errors.age}</p>}
              </div>
              <div>
                <Select value={form.sex ?? ''} onValueChange={(v) => update('sex', v as any)}>
                  <SelectTrigger className={errors.sex ? 'border-destructive w-full' : 'w-full'}><SelectValue placeholder="Sex" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sex && <p className="text-xs text-destructive mt-1">{errors.sex}</p>}
              </div>
              <div>
                <Input type="number" placeholder="Height (cm)" value={form.heightCm ?? ''} onChange={(e) => update('heightCm', Number(e.target.value))} className={errors.heightCm ? 'border-destructive' : ''} />
                {errors.heightCm && <p className="text-xs text-destructive mt-1">{errors.heightCm}</p>}
              </div>
              <div>
                <Input type="number" placeholder="Weight (kg)" value={form.weightKg ?? ''} onChange={(e) => update('weightKg', Number(e.target.value))} className={errors.weightKg ? 'border-destructive' : ''} />
                {errors.weightKg && <p className="text-xs text-destructive mt-1">{errors.weightKg}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">What's your goal?</h2>
                <p className="text-sm text-muted-foreground mt-1">This shapes the whole structure of your plan.</p>
              </div>
              <div className="space-y-2">
                {GOALS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => update('goal', g.value as any)}
                    className={`w-full text-left px-4 py-3 rounded-md border text-sm transition-colors ${
                      form.goal === g.value ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              {errors.goal && <p className="text-xs text-destructive">{errors.goal}</p>}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Your training setup</h2>
              <div>
                <Select value={form.experienceLevel ?? ''} onValueChange={(v) => update('experienceLevel', v as any)}>
                  <SelectTrigger className={errors.experienceLevel ? 'border-destructive w-full' : 'w-full'}><SelectValue placeholder="Experience level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                {errors.experienceLevel && <p className="text-xs text-destructive mt-1">{errors.experienceLevel}</p>}
              </div>
              <div>
                <Input type="number" placeholder="Days available per week (1–7)" value={form.daysAvailable ?? ''} onChange={(e) => update('daysAvailable', Number(e.target.value))} className={errors.daysAvailable ? 'border-destructive' : ''} />
                {errors.daysAvailable && <p className="text-xs text-destructive mt-1">{errors.daysAvailable}</p>}
              </div>
              <div>
                <Input type="number" placeholder="Minutes per session (15–180)" value={form.sessionDurationMinutes ?? ''} onChange={(e) => update('sessionDurationMinutes', Number(e.target.value))} className={errors.sessionDurationMinutes ? 'border-destructive' : ''} />
                {errors.sessionDurationMinutes && <p className="text-xs text-destructive mt-1">{errors.sessionDurationMinutes}</p>}
              </div>
              <div>
                <Select value={form.equipmentAccess ?? ''} onValueChange={(v) => update('equipmentAccess', v as any)}>
                  <SelectTrigger className={errors.equipmentAccess ? 'border-destructive w-full' : 'w-full'}><SelectValue placeholder="Equipment access" /></SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_OPTIONS.map((eq) => <SelectItem key={eq.value} value={eq.value}>{eq.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.equipmentAccess && <p className="text-xs text-destructive mt-1">{errors.equipmentAccess}</p>}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">Any injuries?</h2>
                <p className="text-sm text-muted-foreground mt-1">We'll automatically avoid exercises that could aggravate these.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {INJURY_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag('injuryFlags', tag)}
                    className={`px-4 py-2 rounded-md border text-sm capitalize transition-colors ${
                      form.injuryFlags?.includes(tag) ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
                    }`}
                  >
                    {tag.replace('_', ' ')}
                  </button>
                ))}
              </div>
              {errors.injuryFlags && <p className="text-xs text-destructive">{errors.injuryFlags}</p>}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">Quick health check</h2>
                <p className="text-sm text-muted-foreground mt-1">If any apply, we'll recommend checking with a doctor before starting.</p>
              </div>
              <div className="space-y-3">
                {MEDICAL_OPTIONS.map((m) => (
                  <label key={m.value} className="flex items-center gap-3 text-sm">
                    <Checkbox checked={form.medicalFlags?.includes(m.value) || false} onCheckedChange={() => toggleTag('medicalFlags', m.value)} />
                    {m.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 ? <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button> : <span />}
            {step < TOTAL_STEPS ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleFinish} disabled={loading}>{loading ? 'Saving…' : 'Finish'}</Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save and exit?</DialogTitle>
            <DialogDescription>Your answers so far will be saved as a draft. You can pick up exactly where you left off next time.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowCancelConfirm(false)}>Keep filling out</Button>
            <Button onClick={() => navigate('/dashboard')}>Save & exit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
