import { NextFunction } from "express";
import { validationError } from "../../../../packages/error-handler/errorMiddleware";
import crypto from "crypto";
import { redis } from "./redis";
import { sendEmail } from "../lib/nodeMailer";
import { ValidationError } from "../../../../packages/error-handler/appError";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (
  data: any,
  userType: "admin" | "user" | "seller" = "user"
) => {
  try {
    const { name, email, password, avater, phone_number, address, country } =
      data;

    if (
      !name ||
      !email ||
      !password ||
      !avater ||
      !address ||
      (userType === "seller" && !phone_number) ||
      !country
    ) {
      throw validationError("All fields are required");
    }

    if (!emailRegex.test(email)) {
      throw validationError("Invalid email format");
    }
  } catch (error: any) {
    throw validationError(`Validation error: ${error.message}`);
  }
};

export const checkOtpRestricTion = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError(
        "Your acccount is locked for 30 minutes for incorrect several attempt, try again later!"
      )
    );
  }
  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError(
        "Too many request please wait for an 1 hour before requesting again"
      )
    );
  }
  if (await redis.get(`otp_coolDown:${email}`)) {
    return next(
      new ValidationError("Please wait i minutes before requesting OTP")
    );
  }
};

export const trackOtpRequest = async (email: string, next: NextFunction) => {
  const requestOtpKey = `otp_request_count:${email}`;

  let otpRequest = parseInt((await redis.get(requestOtpKey)) || "0");

  if (otpRequest >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);
    return next(new ValidationError("too may request try again later"));
  }

  return await redis.set(requestOtpKey, otpRequest + 1, "EX", 3600);
};

// create an OTP and store in cache database
export const sendOtp = async (name: string, email: string, template: any) => {
  const OTP = crypto.randomInt(1000, 9999);

  await sendEmail(email, "Verify your account within 5 minutes", template, {
    name,
    OTP,
  });
  await redis.set(`otp:${email}`, OTP, "EX", 300);
  await redis.set(`otp_coolDown:${email}`, "true", "EX", 60);
};
