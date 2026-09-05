import { Exercise, IntakeProfile } from '@prisma/client';

// ============================================
// SPLIT SELECTION
// ============================================
type Split = { type: string; dayCategories: string[][] };

export function determineSplit(daysAvailable: number): Split {
  if (daysAvailable <= 2) {
    return { type: 'full_body', dayCategories: Array(daysAvailable).fill(['legs', 'push', 'pull', 'core']) };
  }
  if (daysAvailable === 3) {
    return { type: 'full_body', dayCategories: Array(3).fill(['legs', 'push', 'pull', 'core']) };
  }
  if (daysAvailable === 4) {
    return {
      type: 'upper_lower',
      dayCategories: [
        ['push', 'pull'],
        ['legs', 'core'],
        ['push', 'pull'],
        ['legs', 'core'],
      ],
    };
  }
  // 5+ days: push/pull/legs rotation
  const pplCycle = [['push'], ['pull'], ['legs'], ['push'], ['pull'], ['legs'], ['core']];
  return { type: 'push_pull_legs', dayCategories: pplCycle.slice(0, daysAvailable) };
}

// ============================================
// TARGET SETS/REPS/RPE BY GOAL
// ============================================
export function getTargetsByGoal(goal: string): { sets: number; reps: number; rpe: number } {
  switch (goal) {
    case 'strength': return { sets: 4, reps: 5, rpe: 8 };
    case 'muscle_gain': return { sets: 4, reps: 10, rpe: 7 };
    case 'fat_loss': return { sets: 3, reps: 12, rpe: 7 };
    case 'endurance': return { sets: 3, reps: 15, rpe: 6 };
    case 'general_fitness':
    default: return { sets: 3, reps: 10, rpe: 6 };
  }
}

// ============================================
// EXERCISE SELECTION (respects equipment + injury exclusions)
// ============================================
export function selectExercisesForCategories(
  categories: string[],
  equipmentAccess: string,
  injuryFlags: string[],
  allExercises: Exercise[],
  countPerCategory = 2
): Exercise[] {
  const selected: Exercise[] = [];

  for (const category of categories) {
    const candidates = allExercises.filter((ex) => {
      const matchesCategory = ex.category === category;
      const matchesEquipment = isEquipmentCompatible(ex.equipmentRequired, equipmentAccess);
      const hasContraindication = (ex.contraindications as string[]).some((tag) => injuryFlags.includes(tag));
      return matchesCategory && matchesEquipment && !hasContraindication;
    });

    selected.push(...candidates.slice(0, countPerCategory));
  }

  return selected;
}

// A user with home_dumbbells can do bodyweight_only exercises too;
// full_gym users can do everything. This defines that fallback hierarchy.
function isEquipmentCompatible(required: string, available: string): boolean {
  const tiers = ['bodyweight_only', 'home_dumbbells', 'full_gym'];
  return tiers.indexOf(required) <= tiers.indexOf(available);
}

// ============================================
// PLAN GENERATION — the main entry point
// ============================================
export interface GeneratedSession {
  dayNumber: number;
  weekNumber: number;
  exerciseId: string;
  targetSets: number;
  targetReps: number;
  targetRpe: number;
}

export function generateWeeklyPlan(
  intake: IntakeProfile,
  allExercises: Exercise[]
): { splitType: string; sessions: GeneratedSession[] } {
  const split = determineSplit(intake.daysAvailable);
  const targets = getTargetsByGoal(intake.goal);
  const injuryFlags = intake.injuryFlags as string[];

  const sessions: GeneratedSession[] = [];

  split.dayCategories.forEach((categories, index) => {
    const exercises = selectExercisesForCategories(
      categories,
      intake.equipmentAccess,
      injuryFlags,
      allExercises
    );

    exercises.forEach((ex) => {
      sessions.push({
        dayNumber: index + 1,
        weekNumber: 1,
        exerciseId: ex.id,
        targetSets: targets.sets,
        targetReps: targets.reps,
        targetRpe: targets.rpe,
      });
    });
  });

  return { splitType: split.type, sessions };
}

// ============================================
// PROGRESSION LOGIC
// ============================================
export interface LogSummary {
  actualReps: number;
  actualRpe: number;
  actualWeight: number;
  targetReps: number;
}

export type ProgressionDecision =
  | { action: 'increase_weight'; percentIncrease: number }
  | { action: 'hold' }
  | { action: 'decrease_weight'; percentDecrease: number }
  | { action: 'deload' };

/**
 * Looks at the last 2 logs for the same exercise and decides what happens next session.
 * This mirrors how a real coach reads recent performance — not just the last single session.
 */
export function calculateProgression(recentLogs: LogSummary[]): ProgressionDecision {
  if (recentLogs.length < 2) return { action: 'hold' };

  const lastTwo = recentLogs.slice(-2);

  const hitTargetBothTimes = lastTwo.every((log) => log.actualReps >= log.targetReps);
  const rpeManageableBothTimes = lastTwo.every((log) => log.actualRpe <= 7);
  const missedTargetBothTimes = lastTwo.every((log) => log.actualReps < log.targetReps);
  const rpeTooHighBothTimes = lastTwo.every((log) => log.actualRpe >= 9);

  if (hitTargetBothTimes && rpeManageableBothTimes) {
    return { action: 'increase_weight', percentIncrease: 5 };
  }

  if (missedTargetBothTimes && rpeTooHighBothTimes) {
    return { action: 'decrease_weight', percentDecrease: 10 };
  }

  return { action: 'hold' };
}

/**
 * Deload trigger: if the last 2 sessions across the board show consistently
 * maxed-out effort (RPE >= 9) without progress, or the plan has run 5+ weeks
 * without a deload, flag a lighter week. Deloads exist to prevent burnout/injury
 * even when the user hasn't asked for one — this is a safety-oriented default.
 */
export function checkDeloadTrigger(currentWeek: number, recentLogs: LogSummary[]): boolean {
  const scheduledDeload = currentWeek % 5 === 0;

  const strugglingAcrossSessions =
    recentLogs.length >= 3 &&
    recentLogs.slice(-3).every((log) => log.actualRpe >= 9 && log.actualReps < log.targetReps);

  return scheduledDeload || strugglingAcrossSessions;
}

// ============================================
// SUBSTITUTION LOGIC
// ============================================
export function getSubstitution(
  originalExercise: Exercise,
  injuryFlags: string[],
  allExercises: Exercise[]
): Exercise | null {
  if (!originalExercise.substitutionGroup) return null;

  const alternatives = allExercises.filter((ex) => {
    const sameGroup = ex.substitutionGroup === originalExercise.substitutionGroup;
    const notSameExercise = ex.id !== originalExercise.id;
    const safeForInjuries = !(ex.contraindications as string[]).some((tag) => injuryFlags.includes(tag));
    return sameGroup && notSameExercise && safeForInjuries;
  });

  return alternatives[0] || null;
}