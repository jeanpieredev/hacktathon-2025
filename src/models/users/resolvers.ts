import { db } from '../../db/config';
import type { User, Prisma } from '@prisma/client';

export const userResolvers = {
  Query: {
    users: async (): Promise<User[]> => {
      return db.user.findMany();
    },

    user: async (_: any, { id }: { id: number }): Promise<User | null> => {
      return db.user.findUnique({ where: { id } });
    },
  },

  Mutation: {
    createUser: async (
      _: any,
      { name, email }: { name: string; email: string }
    ): Promise<User> => {
      return db.user.create({
        data: { name, email },
      });
    },

    updateUser: async (
      _: any,
      { id, name, email }: { id: number; name?: string; email?: string }
    ): Promise<User> => {
      return db.user.update({
        where: { id },
        data: { name, email },
      });
    },

    deleteUser: async (_: any, { id }: { id: number }): Promise<User> => {
      return db.user.delete({
        where: { id },
      });
    },
  },
};
