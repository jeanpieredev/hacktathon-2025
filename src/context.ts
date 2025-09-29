import { PrismaClient } from '@prisma/client';
import type { AuthContext } from './auth/middleware';

const prisma = new PrismaClient();

export type Context = {
  prisma: PrismaClient;
} & AuthContext;

export const createContext = (): Omit<Context, 'user'> => ({ prisma });
