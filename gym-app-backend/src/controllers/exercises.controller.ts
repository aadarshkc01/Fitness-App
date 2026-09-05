import { Request, Response } from 'express';
import { prisma } from '../db/connection';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const listExercises = asyncHandler(async (req: Request, res: Response) => {
  const { equipment, category } = req.query;

  const exercises = await prisma.exercise.findMany({
    where: {
      ...(equipment && typeof equipment === 'string' ? { equipmentRequired: equipment } : {}),
      ...(category && typeof category === 'string' ? { category } : {}),
    },
    orderBy: { name: 'asc' },
  });

  return res.json(new ApiResponse(200, exercises));
});