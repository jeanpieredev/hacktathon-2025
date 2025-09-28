import type { User } from '@prisma/client';

// Context type for GraphQL
export interface Context {
  request: any;
  reply: any;
  user?: User; // Optional user in context for authentication
}

// Re-export Prisma types for convenience
export type { User, Prisma } from '@prisma/client';
