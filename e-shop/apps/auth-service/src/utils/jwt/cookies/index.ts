// import { Response } from 'express';

// /**
//  * Generates a secure HTTP-only cookie configuration for sending tokens.
//  *
//  * @param res - The Express response object.
//  * @param name - The name of the cookie.
//  * @param value - The value to be stored in the cookie.
//  * @returns An object containing the cookie name, stringified value, and options.
//  */
// export const setCookies = (
//   res: Response,
//   name: string,
//   value: any,
//   rememberMe: boolean
// ) => {
//   console.log('remeberMe ===>', rememberMe);
//   // Ensure the value is a stringified JSON object
//   const token = JSON.stringify(value);
//   const cookieOptions = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict' as const,
//     maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 2 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
//   };

//   res.cookie(name, token, cookieOptions);
// };

import { Response } from 'express';

/**
 * Sets a secure HTTP-only cookie for storing tokens.
 *
 * @param res - The Express response object.
 * @param name - The name of the cookie.
 * @param value - The token string (already encoded).
 * @param rememberMe - Whether to persist the cookie for 7 days or 2 days.
 */
export const setCookies = (
  res: Response,
  name: string,
  value: string, // should be the token
  rememberMe: boolean
) => {
  console.log('rememberMe ===>', rememberMe);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 2 * 24 * 60 * 60 * 1000, // 7 days or 2 days
  };

  res.cookie(name, value, cookieOptions);
};
