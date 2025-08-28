import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '../prisma/index';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token || req.cookies.seller_access_token;

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

    const { id, role } = decoded;

    if (!id || !role) {
      return next(new Error('Forbidden: Invalid token payload'));
    }

    let account;

    if (role === 'user') {
      account = await prisma.users.findUnique({
        where: { id: decoded.id },
      });
    } else if (role === 'seller') {
      account = await prisma.sellers.findUnique({
        where: { id: decoded.id },
        include: { shops: true },
      });
    }

    if (!account) {
      return next(new Error('Forbidden: Account not found'));
    }

    req.user = account;
    req.role = role;
    next();
  } catch (err: any) {
    return next(new Error('Authentication failed: ' + err.message));
  }
};

export const authorizeRoles = (...allowedRoles: ('user' | 'seller')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req?.role as any)) {
      return next(new Error('Forbidden: Access denied'));
    }
    next();
  };
};
