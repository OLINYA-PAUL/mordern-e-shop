import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '../../apps/auth-service/src/lib/prisma/index';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  console.log('Token: ===>', token);

  if (!token) {
    return next(new Error('Unauthorized: No token found'));
  }

  console.log('Verifying token...', process.env.ACCESS_TOKEN_SECRET as string);

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as
      | JwtPayload
      | {
          id: string;
          role: 'user' | 'seller';
        };

    console.log('Decoded Token: ===>', decoded);

    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return next(new Error('Forbidden: Account not found'));
    }
    if (user.id !== decoded.id) {
      return next(new Error('Forbidden: Role mismatch'));
    }
    //@ts-ignore
    req.user = user;
    next();
  } catch (err: any) {
    return next(new Error('Authentication failed: ' + err.message));
  }
};
