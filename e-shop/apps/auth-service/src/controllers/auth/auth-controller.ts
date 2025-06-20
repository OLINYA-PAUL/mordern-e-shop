import { NextFunction, Response, Request } from "express";
import { ValidationError } from "@packages/error-handler/appError";
// import { ValidationError } from "../../../../../packages/error-handler/appError";

import {
  validateRegistrationData,
  checkOtpRestricTion,
  sendOtp,
  trackOtpRequest,
  verifyOtp,
} from "../../utils/auth.helper";
import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";
import { accessToken, refressToken } from "../../utils/jwt";
import { setCookies } from "../../utils/jwt/cookies";

interface IAuth {
  email: string;
  name: string;
  password: string;
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

    validateRegistrationData(req.body, "user");

    const userExist = await prisma.users.findUnique({
      where: { email },
    });
    if (userExist) {
      throw new ValidationError("This email is already registered");
    }

    await checkOtpRestricTion(email);
    await trackOtpRequest(email, next);
    await sendOtp(name, email, "user-activation-mail");

    res.status(201).json({
      success: true,
      message: "Otp sent to your email please verify your account",
    });
  } catch (error: any) {
    console.error("Error in registerUser:", error);
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
      throw new ValidationError("all fields are required for verification");
    }

    const userExist = await prisma.users.findUnique({
      where: { email: email }, // Check if user already exists
    });

    if (userExist) {
      throw new ValidationError("This email is already registered");
    }

    await verifyOtp(email, otp, next);

    const hashPassword = await bcrypt.hash(password, 10); // Hash the password
    const user = await prisma.users.create({
      data: { email, name, password: hashPassword },
    });

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log("Error in verifyUserOtp:", error);
    next(error); // So the error middleware can respond
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as IAuth;

    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ValidationError("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      throw new ValidationError("Invalid password");
    }

    // Here you would typically generate a JWT token and send it back
    const access_token = accessToken({ userId: user.id, role: "user" });
    const refress_token = refressToken({ userId: user.id, role: "user" });

    setCookies(res, "access_token", access_token);
    setCookies(res, "refress_token", refress_token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Error in userLogin:", error);
    next(error);
  }
};
