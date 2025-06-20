import express, { Router } from "express";
import {
  registerUser,
  verifyUserOtp,
} from "../controllers/auth/auth-controller";

const authrouter: Router = express.Router();

authrouter.post("/user-registration", registerUser);
authrouter.post("/veriify-otp", verifyUserOtp);

export default authrouter;
