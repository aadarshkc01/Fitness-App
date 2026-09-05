import { Request, Response } from 'express';
import { prisma } from '../db/connection';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { calculateProgression, checkDeloadTrigger, LogSummary } from '../utils/ruleEngine';

/**
 * POST /session-logs
 * Logs a completed set of work for one plan_session, then immediately computes
 * what should happen next time (progression/hold/decrease/deload) using the
 * rule engine — this is what makes the plan feel "alive" instead of static.
 */
export const logSession = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { planSessionId, actualSets, actualReps, actualWeight, actualRpe } = req.body;

  if (!planSessionId || actualSets == null || actualReps == null || actualWeight == null || actualRpe == null) {
    throw new ApiError(400, 'planSessionId, actualSets, actualReps, actualWeight, and actualRpe are required');
  }

  const planSession = await prisma.planSession.findUnique({
    where: { id: planSessionId },
    include: { plan: true },
  });

  if (!planSession || planSession.plan.userId !== userId) {
    throw new ApiError(404, 'Plan session not found');
  }

  const log = await prisma.sessionLog.create({
    data: { userId, planSessionId, actualSets, actualReps, actualWeight, actualRpe },
  });

  // Pull recent history for this same exercise slot to inform the decision
  const recentLogs = await prisma.sessionLog.findMany({
    where: { planSessionId },
    orderBy: { loggedAt: 'desc' },
    take: 3,
  });

  const logSummaries: LogSummary[] = recentLogs
    .reverse()
    .map((l) => ({
      actualReps: l.actualReps,
      actualRpe: l.actualRpe,
      actualWeight: Number(l.actualWeight),
      targetReps: planSession.targetReps,
    }));

  const progression = calculateProgression(logSummaries);
  const deloadNeeded = checkDeloadTrigger(planSession.weekNumber, logSummaries);

  return res.status(201).json(new ApiResponse(201, {
    log,
    nextSessionGuidance: deloadNeeded ? { action: 'deload' } : progression,
  }, 'Session logged'));
});

/**
 * GET /session-logs/history/:planSessionId
 * Returns logged history for one exercise slot — used for progress charts.
 */
export const getSessionHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { planSessionId } = req.params;

  const logs = await prisma.sessionLog.findMany({
    where: { planSessionId, userId },
    orderBy: { loggedAt: 'asc' },
  });

  return res.json(new ApiResponse(200, logs));
});