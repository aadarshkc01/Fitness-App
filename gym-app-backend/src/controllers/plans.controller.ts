import { Request, Response } from 'express';
import { prisma } from '../db/connection';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { generateWeeklyPlan } from '../utils/ruleEngine';

/**
 * POST /plans/generate
 * Builds a fresh weekly plan from the user's saved intake profile.
 * If a PAR-Q flag is active, this refuses to generate a plan — matches the
 * safety principle we set earlier: default to caution, not improvisation.
 */
export const generatePlan = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const intake = await prisma.intakeProfile.findUnique({ where: { userId } });
  if (!intake) throw new ApiError(404, 'Complete your intake profile before generating a plan');

  if (intake.parQStatus === 'flagged_consult_doctor') {
    throw new ApiError(
      403,
      'Based on your health screening, please consult a physician before starting a training plan.'
    );
  }

  const allExercises = await prisma.exercise.findMany();
  const { splitType, sessions } = generateWeeklyPlan(intake, allExercises);

  if (sessions.length === 0) {
    throw new ApiError(500, 'No suitable exercises found for your profile. Try adjusting your equipment access.');
  }

  // Deactivate any existing active plan before creating a new one
  await prisma.plan.updateMany({
    where: { userId, status: 'active' },
    data: { status: 'replaced' },
  });

  const plan = await prisma.plan.create({
    data: {
      userId,
      goal: intake.goal,
      splitType,
      status: 'active',
      sessions: {
        create: sessions.map((s) => ({
          dayNumber: s.dayNumber,
          weekNumber: s.weekNumber,
          exerciseId: s.exerciseId,
          targetSets: s.targetSets,
          targetReps: s.targetReps,
          targetRpe: s.targetRpe,
        })),
      },
    },
    include: { sessions: { include: { exercise: true } } },
  });

  return res.status(201).json(new ApiResponse(201, plan, 'Plan generated'));
});

/**
 * GET /plans/me
 * Returns the user's current active plan with all sessions + exercise details.
 */
export const getMyPlan = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const plan = await prisma.plan.findFirst({
    where: { userId, status: 'active' },
    include: { sessions: { include: { exercise: true }, orderBy: { dayNumber: 'asc' } } },
  });

  if (!plan) throw new ApiError(404, 'No active plan found. Generate one first.');

  return res.json(new ApiResponse(200, plan));
});