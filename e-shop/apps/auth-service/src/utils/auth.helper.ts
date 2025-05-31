import { NextFunction } from "express";
import { validationError } from "../../../../packages/error-handler/errorMiddleware";
import crypto from "crypto";
import { redis } from "./redis";
import { sendEmail } from "../lib/nodeMailer";

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
) => {};

// create an OTP and store in cache database
const sendOtp = async (name: string, email: string, template: any) => {
  const OTP = crypto.randomInt(10000, 9999);

  await sendEmail(email, "Verify your account within 5 minutes", template, {
    name,
    OTP,
  });
  await redis.set(`otp:${email}`, OTP, "EX", 300);
  await redis.set(`otp_coolDown:${email}`, "true", "EX", 60);
};
