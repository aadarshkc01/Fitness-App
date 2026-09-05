import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function connectDB(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully (Prisma → Postgres/Supabase)');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}