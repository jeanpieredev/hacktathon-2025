import { AuthUtils } from './utils';
import { db } from '../db/config';
import type { Context } from '../models/users/types';

/**
 * Authentication middleware for GraphQL context
 */
export async function createAuthContext(request: any, reply: any): Promise<Context> {
  const context: Context = {};

  try {
    // Extract token from Authorization header
    const authHeader = request.headers.authorization;
    const token = AuthUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      return context; // No token, user is not authenticated
    }

    // Verify token
    const decoded = AuthUtils.verifyToken(token);
    
    // Get user from database
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      include: { auth: true }
    });

    if (user) {
      context.user = user;
    }
  } catch (error) {
    // Token is invalid, but we don't throw here
    // Let individual resolvers handle authentication as needed
    console.warn('Authentication error:', error);
  }

  return context;
}

/**
 * Require authentication for a resolver
 */
export function requireAuth(context: any) {
  if (!context.user) {
    throw new Error('Authentication required');
  }
  return context.user;
}
