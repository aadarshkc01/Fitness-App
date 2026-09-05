const API_URL = import.meta.env.VITE_API_URL;

export interface IntakeFormData {
  age: number;
  sex: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  goal: string;
  experienceLevel: string;
  daysAvailable: number;
  sessionDurationMinutes: number;
  equipmentAccess: string;
  injuryFlags: string[];
  medicalFlags: string[];
}

export async function submitIntake(token: string, data: IntakeFormData) {
  const res = await fetch(`${API_URL}/intake`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to save intake profile');
  return result.data;
}

export async function getMyIntake(token: string) {
  const res = await fetch(`${API_URL}/intake/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch intake profile');
  const result = await res.json();
  return result.data;
}
