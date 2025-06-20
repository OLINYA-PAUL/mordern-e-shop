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

    await checkOtpRestricTion(email, next);
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
