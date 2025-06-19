import { NextFunction, Response, Request } from "express";
import { ValidationError } from "@packages/error-handler/appError";
// import { ValidationError } from "../../../../../packages/error-handler/appError";

import {
  validateRegistrationData,
  checkOtpRestricTion,
  sendOtp,
  trackOtpRequest,
} from "../../utils/auth.helper";
import prisma from "../../lib/prisma";

interface IAuth {
  email: string;
  name: string;
}

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name } = req.body satisfies IAuth;

    validateRegistrationData(req.body, "user");

    if (!email || !name) {
      throw new ValidationError("Email and password are required");
    }

    const userExist = await prisma.users.findUnique({
      where: { email: email },
    });
    if (userExist) {
      throw new ValidationError("This email is already registered");
    }

    // const result  = await prisma.users.create({})

    await checkOtpRestricTion(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(name, email, "user-activation-mail");

    res.status(201).json({
      success: true,
      message: "Otp sent to your email please verify your account",
    });
  } catch (error) {
    throw new ValidationError(error as any);
  }
};
