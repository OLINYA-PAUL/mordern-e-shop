import { Response } from "express";

/**
 * Generates a secure HTTP-only cookie configuration for sending tokens.
 *
 * @param res - The Express response object.
 * @param name - The name of the cookie.
 * @param value - The value to be stored in the cookie.
 * @returns An object containing the cookie name, stringified value, and options.
 */
export const setCookies = (res: Response, name: string, value: unknown) => {
  const token = JSON.stringify(value);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  };

  res.cookie(name, token, cookieOptions);
};
