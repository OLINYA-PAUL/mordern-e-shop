// import { Request, Response } from "express";
// import AppError from "./appError";

// export const validationError = (
//   err: Error | any,
//   req?: Request,
//   res?: Response
// ) => {
//   if (err instanceof AppError) {
//     console.log(
//       `Error details: ${req?.method}`,
//       `Request URL: ${req?.originalUrl}`,
//       `Error message: ${err.message}`,
//       `Error status: ${err.statusCode}`,
//       ...(err.details ? [`Error details: ${JSON.stringify(err.details)}`] : [])
//     );

//     return res?.status(err.statusCode || 400).json({
//       error: err.message,
//       errorDetails: err.details,
//       errorStatus: err.statusCode,
//     });
//   }

//   // ✅ Handle all other errors
//   console.error("Unhandled Error:", err);

//   return res?.status(500).json({
//     error: "Something went wrong.",
//     message: err.message,
//   });
// };

import { Request, Response, NextFunction } from "express";
import AppError from "./appError";

export const validationError = (
  err: Error | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    console.log(
      `Error details: ${req.method}`,
      `Request URL: ${req.originalUrl}`,
      `Error message: ${err.message}`,
      `Error status: ${err.statusCode}`,
      ...(err.details ? [`Error details: ${JSON.stringify(err.details)}`] : [])
    );

    return res.status(err.statusCode || 400).json({
      error: err.message,
      errorDetails: err.details,
      errorStatus: err.statusCode,
    });
  }

  // ✅ Handle other unknown errors
  console.error("Unhandled Error:", err);

  return res.status(500).json({
    error: "Something went wrong.",
    message: err.message,
  });
};
