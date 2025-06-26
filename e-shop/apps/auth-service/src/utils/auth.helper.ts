import { NextFunction, Response, Request } from "express";
import crypto from "crypto";
import { redis } from "./redis";
import { sendEmail } from "../lib/nodeMailer";
import { ValidationError } from "../../../../packages/error-handler/appError";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

// export const validateRegistrationData = (
//   data: any,
//   userType: "user" | "seller" = "user"
// ) => {
//   const { name, email, password, avater, phone_number, address, country } =
//     data;

//   if (
//     !name ||
//     !email ||
//     !password ||
//     !avater ||
//     !address ||
//     (userType === "seller" && !phone_number) ||
//     !country
//   ) {
//     throw new ValidationError("All fields are required");
//   }

//   if (!emailRegex.test(email)) {
//     throw new ValidationError("Invalid email format");
//   }
// };

export const validateRegistrationData = (
  data: any,
  userType: "user" | "seller" = "user"
) => {
  const { name, email, password, avater, phone_number, address, country } =
    data;

  if (!name || !email || !password) {
    throw new ValidationError("Name, email and password are required");
  }

  if (userType === "seller") {
    if (!phone_number || !address || !country || !avater) {
      throw new ValidationError("All seller fields are required");
    }
  }

  if (typeof email !== "string" || !emailRegex.test(email.trim())) {
    throw new ValidationError("Invalid email format");
  }
};

export const checkOtpRestricTion = async (email: string) => {
  if (await redis.get(`otp_lock:${email}`)) {
    throw new ValidationError(
      "Your account is locked for 30 minutes due to several incorrect attempts. Try again later!"
    );
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    throw new ValidationError(
      "Too many requests. Please wait 1 hour before requesting again."
    );
  }

  if (await redis.get(`otp_coolDown:${email}`)) {
    throw new ValidationError(
      "Please wait 1 minute before requesting a new OTP."
    );
  }
};

export const trackOtpRequest = async (email: string, next: NextFunction) => {
  const requestOtpKey = `otp_request_count:${email}`;
  const otpRequest = parseInt((await redis.get(requestOtpKey)) || "0");

  if (otpRequest >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);
    return next(new ValidationError("Too many requests. Try again later."));
  }

  return await redis.set(requestOtpKey, otpRequest + 1, "EX", 3600);
};

export const sendOtp = async (name: string, email: string, template: any) => {
  const OTP = crypto.randomInt(1000, 9999);

  await sendEmail(email, "Verify your account within 5 minutes", template, {
    name,
    OTP,
  });

  await redis.set(`otp:${email}`, OTP, "EX", 300);
  await redis.set(`otp_coolDown:${email}`, "true", "EX", 60);
};

export const verifyOtp = async (
  email: string,
  otp: string,
  next: NextFunction
) => {
  try {
    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp) {
      throw new ValidationError("OTP has expired or is invalid");
    }

    const failedAttempsKey = `otp_request_count:${email}`;
    const failedAttempsOtp = parseInt(
      (await redis.get(failedAttempsKey)) || "0"
    );

    if (otp !== storedOtp) {
      if (failedAttempsOtp >= 2) {
        await redis.set(`otp_lock:${email}`, "locked", "EX", 1800);
        await redis.del(`otp:${email}`, failedAttempsKey);
        await redis.del(`otp:${email}`);
        await redis.del(`otp_coolDown:${email}`);
        await redis.del(`otp_lock:${email}`);
        await redis.del(`otp_spam_lock:${email}`);
        await redis.del(`otp_request_count:${email}`);
        throw new ValidationError(
          "Your account is locked for 30 minutes due to several incorrect attempts. Try again later!"
        );
      }

      await redis.set(failedAttempsKey, failedAttempsOtp + 1, "EX", 3600);
      throw new ValidationError(
        `Incorrect OTP. You have ${
          2 - failedAttempsOtp
        } attempts left before your account is locked for 30 minutes.`
      );
    }

    await redis.del(`otp:${email}`, failedAttempsKey); // Clear failed attempts on successful verification
    await redis.del(`otp_coolDown:${email}`); // Clear cooldown after successful verification
    await redis.del(`otp_lock:${email}`); // Clear lock if it exists
    await redis.del(`otp_spam_lock:${email}`); // Clear spam lock if it exists
    await redis.del(`otp_request_count:${email}`); // Clear request count after successful verification
  } catch (error: any) {
    return next(new ValidationError("Failed to verify OTP: " + error.message));
  }
};

export const handleForgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "user" | "seller" = "user"
) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ValidationError("Email is required");
    }

    try {
      const user =
        userType === "user" &&
        (await prisma.users.findUnique({ where: { email } }));

      if (!user) {
        throw new ValidationError("User not found");
      }

      await checkOtpRestricTion(email);
      await trackOtpRequest(email, next);
      await sendOtp(
        user.name!,
        email,
        `${userType === "user" && "forget-password-otp-reset"}`
      );

      res.status(200).json({
        success: true,
        message: "OTP sent to your email",
      });
    } catch (error) {
      console.error("Error requesting password reset:", error);
      next(error);
    }
  } catch (error) {
    next();
  }
};

interface IResetPassword {
  email: string;
  password: string;
  otp: string;
}

export const handleSendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "user" | "seller" = "user"
) => {
  const { email, password, otp } = req.body as IResetPassword;

  if (!email || !password || !otp) {
    throw new ValidationError("All fields are required");
  }

  try {
    const user =
     
      (await prisma.users.findUnique({
        where: { email },
      }));

    if (!user) {
      throw new ValidationError("User not found");
    }

    await verifyOtp(email, otp, next);

    const isSamePassword = await bcrypt.compare(password, user.password!);
    if (isSamePassword) {
      throw new ValidationError(
        "New password must be different from the old one"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error in Reseting password:", error);
    next(error);
  }
};

interface IOtpVerification {
  email: string;
  otp: string;
}

export const handleVerifyForgetPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, otp } = req.body as IOtpVerification;

  if (!email || !otp) {
    throw new ValidationError("Email, and OTP are required");
  }

  try {
    await verifyOtp(email, otp, next);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully, You can now reset your password",
    });
  } catch (error) {
    console.error("Error in verifyForgetPasswordOtp:", error);
    next(error);
  }
};
