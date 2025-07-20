import { NextFunction, Response, Request } from 'express';
import { ValidationError } from '@packages/error-handler/appError';
// import { ValidationError } from "../../../../../packages/error-handler/appError";
import jwt, { JwtPayload } from 'jsonwebtoken';

import {
  validateRegistrationData,
  checkOtpRestricTion,
  sendOtp,
  trackOtpRequest,
  verifyOtp,
  handleForgetPassword,
  handleResetPassword,
  handleVerifyForgetPasswordOtp,
} from '../../utils/auth.helper';
import prisma from '../../lib/prisma';
import { accessToken, refressToken } from '../../utils/jwt';
import { setCookies } from '../../utils/jwt/cookies';
import bcrypt from 'bcrypt';
import { JsonWebTokenError } from 'jsonwebtoken';

interface IAuth {
  email: string;
  name: string;
  password: string;
  rememberMe: boolean;
}

// export const registerUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { email, name, password } = req.body as IAuth;

//     validateRegistrationData(req.body, "user");

//     if (!email || !name || !password) {
//       throw new ValidationError("all fields are required");
//     }

//     const userExist = await prisma.users.findUnique({
//       where: { email: email },
//     });
//     if (userExist) {
//       throw new ValidationError("This email is already registered");
//     }

//     // const result = await prisma.users.create({
//     //   data: {
//     //     email,
//     //     name,
//     //     password, // Make sure to hash the password before storing it
//     //   },
//     // });

//     await checkOtpRestricTion(email, next);
//     await trackOtpRequest(email, next);
//     await sendOtp(name, email, "user-activation-mail");

//     res.status(201).json({
//       success: true,
//       message: "Otp sent to your email please verify your account",
//     });
//   } catch (error: any) {
//     console.error("Error in registerUser:", error);
//   }
// };

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name } = req.body as IAuth;

    validateRegistrationData(req.body, 'user');

    const userExist = await prisma.users.findUnique({
      where: { email },
    });
    if (userExist) {
      throw new ValidationError('This email is already registered');
    }

    await checkOtpRestricTion(email);
    await trackOtpRequest(email, next);
    await sendOtp(name, email, 'user-activation-mail');

    res.status(201).json({
      success: true,
      message: 'Otp sent to your email please verify your account',
    });
  } catch (error: any) {
    console.error('Error in registerUser:', error);
    next(error); // So the error middleware can respond
  }
};

interface IOtpVerification {
  otp: string;
  email: string;
  name: string;
  password?: string;
}

export const verifyUserOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { otp, email, password, name } = req.body as IOtpVerification;

    if (!email || !name || !password || !otp) {
      throw new ValidationError('all fields are required for verification');
    }

    const userExist = await prisma.users.findUnique({
      where: { email: email }, // Check if user already exists
    });

    if (userExist) {
      throw new ValidationError('This email is already registered');
    }

    await verifyOtp(email, otp);

    const hashPassword = await bcrypt.hash(password, 10); // Hash the password
    const user = await prisma.users.create({
      data: { email, name, password: hashPassword },
    });

    res.status(200).json({
      success: true,
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.log('Error in verifyUserOtp:', error);
    next(error); // So the error middleware can respond
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, rememberMe = false } = req.body as IAuth;

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ValidationError('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      throw new ValidationError('Invalid password');
    }

    // Here you would typically generate a JWT token and send it back
    const access_token = accessToken({ id: user.id, role: 'user' });
    const refress_token = refressToken({ id: user.id, role: 'user' });

    setCookies(res, 'access_token', access_token, rememberMe);
    setCookies(res, 'refress_token', refress_token, rememberMe);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error('Error in userLogin:', error);
    next(error);
  }
};

export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await handleForgetPassword(req, res, next, 'user');
};

export const verifyForgetPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await handleVerifyForgetPasswordOtp(req, res, next);
};

export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await handleResetPassword(req, res, next);
};

export const refressUserToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refress_token.toString();

    if (!refreshToken) {
      throw new ValidationError('Unauthorized! No refresh token');
    }
    // const rawToken = refreshToken.replace(/^"|"$/g, '');
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESS_TOKEN_SECRET as string
    ) as { id: string; role: string } | JwtPayload;

    if (!decoded || !decoded.id || !decoded.role) {
      throw new JsonWebTokenError('Forbidden! Invalid refresh token');
    }

    // Fetch user from database
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new ValidationError('User not found');
    }

    // Create new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' }
    );

    // Set new access token cookie
    setCookies(res, 'access_token', newAccessToken, true);

    res.status(201).json({ message: 'Access token refreshed' });
  } catch (error) {
    console.error('Error refreshing user token:', error);
    next(error);
  }
};

export const logOutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie('access_token', { maxAge: 0 });
    res.clearCookie('refresh_token', { maxAge: 0 });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Error in logging out user:', error);
    next(error);
  }
};

export const getUser = async (
  req: Request,

  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.user?.id;

    console.log('User ID from request:', userId);

    if (!userId) {
      throw new ValidationError('User ID not found in request');
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ValidationError('User not found');
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    next(error);
  }
};
