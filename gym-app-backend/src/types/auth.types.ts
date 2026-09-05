export type UserRole = 'super_admin' | 'trainer' | 'member';

export interface AppJwtPayload {
  userId: string;
  role: UserRole;
  tokenVersion: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AppJwtPayload;
    }
  }
}