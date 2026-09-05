import { PrismaClient } from '@prisma/client';

declare const process: {
  exit(code?: number): never;
};

const prisma = new PrismaClient();

const exercises = [
  { name: 'Bodyweight Squat', category: 'legs', muscleGroup: 'quads_glutes', equipmentRequired: 'bodyweight_only', difficultyLevel: 'beginner', contraindications: ['knee'], substitutionGroup: 'squat_pattern', formCueSummary: 'Feet shoulder-width, chest up, push hips back, knees track over toes.' },
  { name: 'Push-Up', category: 'push', muscleGroup: 'chest_triceps', equipmentRequired: 'bodyweight_only', difficultyLevel: 'beginner', contraindications: ['shoulder'], substitutionGroup: 'horizontal_press', formCueSummary: 'Hands under shoulders, straight body line, lower chest to just above floor.' },
  { name: 'Glute Bridge', category: 'legs', muscleGroup: 'glutes_hamstrings', equipmentRequired: 'bodyweight_only', difficultyLevel: 'beginner', contraindications: [], substitutionGroup: 'hip_hinge', formCueSummary: 'Feet flat, drive hips up squeezing glutes, avoid arching lower back.' },
  { name: 'Plank', category: 'core', muscleGroup: 'core', equipmentRequired: 'bodyweight_only', difficultyLevel: 'beginner', contraindications: ['lower_back'], substitutionGroup: 'core_hold', formCueSummary: 'Straight line head to heels, brace core, avoid hips sagging.' },
  { name: 'Dumbbell Goblet Squat', category: 'legs', muscleGroup: 'quads_glutes', equipmentRequired: 'home_dumbbells', difficultyLevel: 'beginner', contraindications: ['knee'], substitutionGroup: 'squat_pattern', formCueSummary: 'Hold dumbbell at chest, squat between knees, drive up through heels.' },
  { name: 'Dumbbell Romanian Deadlift', category: 'legs', muscleGroup: 'hamstrings_glutes', equipmentRequired: 'home_dumbbells', difficultyLevel: 'intermediate', contraindications: ['lower_back'], substitutionGroup: 'hip_hinge', formCueSummary: 'Slight knee bend, hinge at hips with flat back, feel hamstring stretch.' },
  { name: 'Dumbbell Bench Press', category: 'push', muscleGroup: 'chest_triceps', equipmentRequired: 'home_dumbbells', difficultyLevel: 'intermediate', contraindications: ['shoulder'], substitutionGroup: 'horizontal_press', formCueSummary: 'Press dumbbells up over chest, control the descent.' },
  { name: 'Dumbbell Row', category: 'pull', muscleGroup: 'back_biceps', equipmentRequired: 'home_dumbbells', difficultyLevel: 'beginner', contraindications: ['lower_back'], substitutionGroup: 'horizontal_pull', formCueSummary: 'Flat back, pull dumbbell to hip squeezing shoulder blade.' },
  { name: 'Barbell Back Squat', category: 'legs', muscleGroup: 'quads_glutes', equipmentRequired: 'full_gym', difficultyLevel: 'intermediate', contraindications: ['knee', 'lower_back'], substitutionGroup: 'squat_pattern', formCueSummary: 'Bar on upper traps, brace core, squat to at least parallel.' },
  { name: 'Barbell Deadlift', category: 'pull', muscleGroup: 'posterior_chain', equipmentRequired: 'full_gym', difficultyLevel: 'advanced', contraindications: ['lower_back'], substitutionGroup: 'hip_hinge', formCueSummary: 'Bar over mid-foot, flat back, drive through the floor.' },
  { name: 'Barbell Bench Press', category: 'push', muscleGroup: 'chest_triceps', equipmentRequired: 'full_gym', difficultyLevel: 'intermediate', contraindications: ['shoulder'], substitutionGroup: 'horizontal_press', formCueSummary: 'Retract shoulder blades, lower bar to mid-chest with control.' },
  { name: 'Lat Pulldown', category: 'pull', muscleGroup: 'back_biceps', equipmentRequired: 'full_gym', difficultyLevel: 'beginner', contraindications: ['shoulder'], substitutionGroup: 'vertical_pull', formCueSummary: 'Slight lean back, pull bar to upper chest leading with elbows.' },
];

async function main() {
  for (const ex of exercises) {
    await prisma.exercise.create({ data: ex as any });
  }
  console.log(`Seeded ${exercises.length} exercises.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());