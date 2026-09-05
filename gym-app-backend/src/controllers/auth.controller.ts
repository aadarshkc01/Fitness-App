import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabasePublic, supabaseAdmin } from '../config/supabase';
import { prisma } from '../db/connection';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

const JWT_SECRET = process.env.JWT_SECRET as string;

function issueAppToken(userId: string, role: string, tokenVersion: number) {
  return jwt.sign({ userId, role, tokenVersion }, JWT_SECRET, { expiresIn: '7d' });
}

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName) {
    throw new ApiError(400, 'email, password, and fullName are required');
  }

  const { data, error } = await supabasePublic.auth.signUp({
    email, password, options: { data: { full_name: fullName } },
  });
  if (error || !data.user) throw new ApiError(400, error?.message || 'Signup failed');

  const profile = await prisma.profile.findUnique({ where: { id: data.user.id } });
  const token = issueAppToken(data.user.id, profile?.role || 'member', profile?.tokenVersion ?? 0);

  return res.status(201).json(new ApiResponse(201, {
    token,
    user: { id: data.user.id, email: data.user.email, fullName, role: profile?.role || 'member' },
  }, 'Signup successful'));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'email and password are required');

  const { data, error } = await supabasePublic.auth.signInWithPassword({ email, password });
  if (error || !data.user) throw new ApiError(401, 'Invalid email or password');

  const profile = await prisma.profile.findUnique({ where: { id: data.user.id } });
  if (!profile) throw new ApiError(500, 'Could not load user profile');

  const token = issueAppToken(data.user.id, profile.role, profile.tokenVersion);

  return res.json(new ApiResponse(200, {
    token,
    user: { id: data.user.id, email: data.user.email, fullName: profile.fullName, role: profile.role },
  }, 'Login successful'));
});

export const oauthExchange = asyncHandler(async (req: Request, res: Response) => {
  const { supabaseAccessToken } = req.body;
  if (!supabaseAccessToken) throw new ApiError(400, 'supabaseAccessToken is required');

  const { data: userData, error } = await supabaseAdmin.auth.getUser(supabaseAccessToken);
  if (error || !userData.user) throw new ApiError(401, 'Invalid Supabase session');

  const profile = await prisma.profile.findUnique({ where: { id: userData.user.id } });
  if (!profile) throw new ApiError(500, 'Could not load user profile');

  const token = issueAppToken(userData.user.id, profile.role, profile.tokenVersion);

  return res.json(new ApiResponse(200, {
    token,
    user: { id: userData.user.id, email: userData.user.email, fullName: profile.fullName, role: profile.role },
  }, 'OAuth login successful'));
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  return res.json(new ApiResponse(200, null, 'Logged out. Please discard your token on the client.'));
});

export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await prisma.profile.update({
    where: { id: userId },
    data: { tokenVersion: { increment: 1 } },
  });
  return res.json(new ApiResponse(200, null, 'Logged out of all devices. All previous tokens are now invalid.'));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  return res.json(new ApiResponse(200, { user: req.user }));
});