import { JwtPayload } from 'jsonwebtoken';
import { User } from '@prisma/client';
import Express from 'express';

declare global {
  namespace Express {
    interface Request {
      user: string | JwtPayload | User;
      role: 'user' | 'seller';
    }
  }
}
