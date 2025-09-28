import type { User, Auth, UserType } from '@prisma/client';

// Extended context type for GraphQL that includes our custom properties
export interface Context {
  user?: User; // Optional user in context for authentication
}

// GraphQL Input Types
export interface CreateUserInput {
  name: string;
  type: UserType;
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  type?: UserType;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

// Re-export Prisma types for convenience
export type { User, Auth, UserType, Prisma } from '@prisma/client';
