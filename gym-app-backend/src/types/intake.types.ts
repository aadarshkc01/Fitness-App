export type Goal = 'fat_loss' | 'muscle_gain' | 'strength' | 'general_fitness' | 'endurance';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type EquipmentAccess = 'bodyweight_only' | 'home_dumbbells' | 'full_gym';
export type ParQStatus = 'cleared' | 'flagged_consult_doctor';

export interface IntakeProfileInput {
  age: number;
  sex: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  goal: Goal;
  experienceLevel: ExperienceLevel;
  daysAvailable: number;
  sessionDurationMinutes: number;
  equipmentAccess: EquipmentAccess;
  injuryFlags: string[];
  medicalFlags: string[];
  measurements?: Record<string, number>;
}

export const RED_FLAG_CONDITIONS = [
  'heart_condition',
  'chest_pain_with_activity',
  'uncontrolled_blood_pressure',
  'recent_surgery',
  'pregnancy_complications',
  'dizziness_or_fainting',
];

export function determineParQStatus(medicalFlags: string[]): ParQStatus {
  const hasRedFlag = medicalFlags.some((flag) => RED_FLAG_CONDITIONS.includes(flag));
  return hasRedFlag ? 'flagged_consult_doctor' : 'cleared';
}