import { Request, Response } from 'express';
import { prisma } from '../db/connection';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * PATCH /profile
 * Updates the logged-in user's editable profile fields. Currently just
 * fullName — role and tokenVersion are never client-editable.
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { fullName } = req.body;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
    throw new ApiError(400, 'fullName is required');
  }

  const updated = await prisma.profile.update({
    where: { id: userId },
    data: { fullName: fullName.trim() },
  });

  return res.json(new ApiResponse(200, {
    id: updated.id,
    fullName: updated.fullName,
    role: updated.role,
  }, 'Profile updated'));
});
