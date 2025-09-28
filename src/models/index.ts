import { userSchema, userResolvers } from './users';

// Combine all schemas
export const schema = `
  ${userSchema}
`;

// Combine all resolvers
export const resolvers = {
  ...userResolvers,
};

// Export types
export type { Context } from './users';
