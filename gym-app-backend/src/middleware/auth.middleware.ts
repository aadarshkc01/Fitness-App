import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/connection';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { AppJwtPayload, UserRole } from '../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticate = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Missing or malformed Authorization header');
  }

  const token = authHeader.split(' ')[1];
  let decoded: AppJwtPayload;

  try {
    decoded = jwt.verify(token, JWT_SECRET) as AppJwtPayload;
  } catch {
    throw new ApiError(401, 'Invalid or expired token');
  }

  const profile = await prisma.profile.findUnique({
    where: { id: decoded.userId },
    select: { tokenVersion: true, role: true },
  });

  if (!profile) throw new ApiError(401, 'User not found');
  if (profile.tokenVersion !== decoded.tokenVersion) {
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  req.user = { userId: decoded.userId, role: profile.role as UserRole, tokenVersion: profile.tokenVersion };
  next();
});

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to access this resource');
    }
    next();
  };
}