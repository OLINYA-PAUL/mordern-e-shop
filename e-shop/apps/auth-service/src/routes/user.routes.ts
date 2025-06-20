import express, { Router } from "express";
import {
  loginUser,
  registerUser,
  verifyUserOtp,
} from "../controllers/auth/auth-controller";

const authrouter: Router = express.Router();

authrouter.post("/user-registration", registerUser);
authrouter.post("/veriify-user", verifyUserOtp);
authrouter.post("/login-user", loginUser);

export default authrouter;
