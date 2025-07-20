import { JwtPayload } from "jsonwebtoken";
import Express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}
