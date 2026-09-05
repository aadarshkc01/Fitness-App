import { Request, Response } from 'express';
import { prisma } from '../db/connection';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { IntakeProfileInput, determineParQStatus } from '../types/intake.types';

export const saveIntake = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const body = req.body as IntakeProfileInput;

  const required: (keyof IntakeProfileInput)[] = [
    'age', 'sex', 'heightCm', 'weightKg', 'goal', 'experienceLevel',
    'daysAvailable', 'sessionDurationMinutes', 'equipmentAccess',
  ];
  const missing = required.filter((f) => body[f] === undefined || body[f] === null);
  if (missing.length > 0) throw new ApiError(400, `Missing required fields: ${missing.join(', ')}`);

  const parQStatus = determineParQStatus(body.medicalFlags || []);

  const profile = await prisma.intakeProfile.upsert({
    where: { userId },
    update: {
      age: body.age, sex: body.sex, heightCm: body.heightCm, weightKg: body.weightKg,
      goal: body.goal, experienceLevel: body.experienceLevel, daysAvailable: body.daysAvailable,
      sessionDurationMinutes: body.sessionDurationMinutes, equipmentAccess: body.equipmentAccess,
      injuryFlags: body.injuryFlags || [], medicalFlags: body.medicalFlags || [],
      parQStatus, measurements: body.measurements || {},
    },
    create: {
      userId, age: body.age, sex: body.sex, heightCm: body.heightCm, weightKg: body.weightKg,
      goal: body.goal, experienceLevel: body.experienceLevel, daysAvailable: body.daysAvailable,
      sessionDurationMinutes: body.sessionDurationMinutes, equipmentAccess: body.equipmentAccess,
      injuryFlags: body.injuryFlags || [], medicalFlags: body.medicalFlags || [],
      parQStatus, measurements: body.measurements || {},
    },
  });

  return res.status(201).json(new ApiResponse(201, profile, 'Intake profile saved'));
});

export const getMyIntake = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const profile = await prisma.intakeProfile.findUnique({ where: { userId } });
  if (!profile) throw new ApiError(404, 'No intake profile found for this user');
  return res.json(new ApiResponse(200, profile));
});