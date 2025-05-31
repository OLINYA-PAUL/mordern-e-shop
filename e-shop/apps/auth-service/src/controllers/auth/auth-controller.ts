import { NextFunction, Response, Request } from "express";
import { validationError } from "../../../../../packages/error-handler/errorMiddleware";
import {
  validateRegistrationData,
  checkOtpRestricTion,
} from "../../utils/auth.helper";
import prisma from "../../lib/prisma";

interface IAuth {
  email: string;
  password: string;
}

export const authController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body satisfies IAuth;

    validateRegistrationData(req.body, "user");

    if (!email || !password) {
      throw validationError("Email and password are required");
    }

    const userExsite = await prisma.users.findUnique({
      where: { email: email },
    });
    if (userExsite) {
      throw validationError("This email is already registered");
    }

    // const result  = await prisma.users.create({})

    await checkOtpRestricTion(email, next);
  } catch (error) {
    throw validationError(error as Error, req, res);
  }
};
