import { db } from '../../db/config';
import { AuthUtils } from '../../auth/utils';
import type {
  User,
  Auth,
  UserType,
  CreateUserInput,
  UpdateUserInput,
  LoginInput,
  AuthPayload,
  Context,
} from './types';

export const userResolvers = {
  Query: {
    users: async (): Promise<User[]> => {
      return db.user.findMany({
        include: { auth: true },
      });
    },

    user: async (_: any, { id }: { id: number }): Promise<User | null> => {
      return db.user.findUnique({
        where: { id },
        include: { auth: true },
      });
    },

    me: async (_: any, __: any, context: any): Promise<User | null> => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      return db.user.findUnique({
        where: { id: context.user.id },
        include: { auth: true },
      });
    },
  },

  Mutation: {
    createUser: async (
      _: any,
      { input }: { input: CreateUserInput }
    ): Promise<User> => {
      // Check if email already exists
      const existingAuth = await db.auth.findUnique({
        where: { email: input.email },
      });

      if (existingAuth) {
        throw new Error('Email already exists');
      }

      // Hash password
      const hashedPassword = await AuthUtils.hashPassword(input.password);

      // Create user with auth in a transaction
      return db.$transaction(async tx => {
        const auth = await tx.auth.create({
          data: {
            email: input.email,
            password: hashedPassword,
          },
        });

        return tx.user.create({
          data: {
            name: input.name,
            type: input.type,
            authId: auth.id,
          },
          include: { auth: true },
        });
      });
    },

    updateUser: async (
      _: any,
      { id, input }: { id: number; input: UpdateUserInput }
    ): Promise<User> => {
      return db.user.update({
        where: { id },
        data: input,
        include: { auth: true },
      });
    },

    deleteUser: async (_: any, { id }: { id: number }): Promise<User> => {
      return db.$transaction(async tx => {
        const user = await tx.user.findUnique({
          where: { id },
          include: { auth: true },
        });

        if (!user) {
          throw new Error('User not found');
        }

        // Delete auth record if it exists
        if (user.authId) {
          await tx.auth.delete({
            where: { id: user.authId },
          });
        }

        return tx.user.delete({
          where: { id },
        });
      });
    },

    register: async (
      _: any,
      { input }: { input: CreateUserInput }
    ): Promise<AuthPayload> => {
      // Check if email already exists
      const existingAuth = await db.auth.findUnique({
        where: { email: input.email },
      });

      if (existingAuth) {
        throw new Error('Email already exists');
      }

      // Hash password
      const hashedPassword = await AuthUtils.hashPassword(input.password);

      // Create user with auth in a transaction
      const user = await db.$transaction(async tx => {
        const auth = await tx.auth.create({
          data: {
            email: input.email,
            password: hashedPassword,
          },
        });

        return tx.user.create({
          data: {
            name: input.name,
            type: input.type,
            authId: auth.id,
          },
          include: { auth: true },
        });
      });

      const token = AuthUtils.generateToken(user);

      return {
        token,
        user,
      };
    },

    login: async (
      _: any,
      { input }: { input: LoginInput }
    ): Promise<AuthPayload> => {
      // Find auth record
      const auth = await db.auth.findUnique({
        where: { email: input.email },
        include: { user: true },
      });

      if (!auth || !auth.user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await AuthUtils.comparePassword(
        input.password,
        auth.password
      );

      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const token = AuthUtils.generateToken(auth.user);

      return {
        token,
        user: auth.user,
      };
    },

    logout: async (): Promise<boolean> => {
      // In a stateless JWT setup, logout is handled client-side
      // by removing the token. This endpoint exists for consistency.
      return true;
    },
  },
};
