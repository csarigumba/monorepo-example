import jwt from 'jsonwebtoken';
import { logger } from '@company/logger';

export interface TokenPayload {
  userId: string;
  email: string;
  exp?: number;
  iat?: number;
}

export class AuthService {
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  }

  generateToken(payload: Omit<TokenPayload, 'exp' | 'iat'>): string {
    try {
      return jwt.sign(payload, this.jwtSecret, {
        expiresIn: '24h',
      });
    } catch (error) {
      logger.error('Error generating JWT token', { error });
      throw new Error('Failed to generate token');
    }
  }

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as TokenPayload;
    } catch (error) {
      logger.error('Error verifying JWT token', { error });
      throw new Error('Invalid token');
    }
  }

  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

export const authService = new AuthService();