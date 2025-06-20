import { NextFunction } from "express";
import crypto from "crypto";
import { redis } from "./redis";
import { sendEmail } from "../lib/nodeMailer";
import { ValidationError } from "../../../../packages/error-handler/appError";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export const checkOtpRestricTion = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError(
        "Your account is locked for 30 minutes due to several incorrect attempts. Try again later!"
      )
    );
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError(
        "Too many requests. Please wait 1 hour before requesting again."
      )
    );
  }

  if (await redis.get(`otp_coolDown:${email}`)) {
    return next(
      new ValidationError("Please wait 1 minute before requesting a new OTP.")
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
